import { ObjectId } from "mongodb";
import client from "../lib/db.js";
import dotenv from "dotenv";
import { ziniPayCreatePayment } from "./zinpay.controller.js";
dotenv.config();

const orderCollection = client.db("oiki_store").collection("orders");
const productCollection = client.db("oiki_store").collection("products");
const shippingRateCollection = client
  .db("oiki_store")
  .collection("shipping_rates");
const userCollection = client.db("oiki_store").collection("users");

export const createOrder = async (req, res) => {
  const { customer, products, user, paymentMethod } = req.body;

  if (!customer || !products) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User is required" });
  }

  try {
    // 1. Shipping charge বের করো
    const insideDhaka = await shippingRateCollection.findOne({
      "location.value": customer.district,
    });
    const outsideDhaka = await shippingRateCollection.findOne({
      "location.value": "all",
    });

    let shippingCharge = 0;
    if (insideDhaka) {
      shippingCharge = insideDhaka.baseCharge + (insideDhaka.extraCharge ?? 0);
    } else if (outsideDhaka) {
      shippingCharge =
        outsideDhaka.baseCharge + (outsideDhaka.extraCharge ?? 0);
    }

    // 2. Products process করো
    const orderProducts = [];
    for (const product of products) {
      const productData = await productCollection.findOne({
        _id: new ObjectId(product.productId),
      });

      if (!productData) {
        return res
          .status(400)
          .json({ success: false, message: "Product not found" });
      }

      // Variant stock update
      const variantData = productData.variantDetails.map((variant) => {
        if (variant.color === product.color) {
          return {
            ...variant,
            sizes: variant.sizes.map((size) =>
              size.size === product.size
                ? { ...size, stock: size.stock - product.quantity }
                : size,
            ),
          };
        }
        return variant;
      });

      await productCollection.updateOne(
        { _id: new ObjectId(product.productId) },
        { $set: { variantDetails: variantData } },
      );

      // আসল price database থেকে নাও
      const matchedVariant = productData.variantDetails
        .find((v) => v.color === product.color)
        ?.sizes.find((s) => s.size === product.size);

      const unitPrice =
        matchedVariant?.discount ?? matchedVariant?.price ?? productData.price;

      orderProducts.push({
        productId: productData._id,
        productName: productData.productName,
        color: product.color,
        size: product.size,
        quantity: product.quantity,
        price: unitPrice, // ✅ database থেকে আসল price
      });
    }

    // 3. Total হিসাব করো
    const subtotal = orderProducts.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0,
    );
    const totalPrice = subtotal + shippingCharge;

    // 4. Order বানাও
    if (paymentMethod === "cod") {
      const order = {
        user: user._id ? user._id : user,
        customer,
        products: orderProducts,
        shippingCharge,
        subtotal,
        totalPrice,
        status: "pending",
        paymentMethod,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await orderCollection.insertOne(order);

      res
        .status(201)
        .json({ success: true, message: "Order created successfully", order });
    }

    if (paymentMethod === "online") {
      try {
        const payload = {
          cus_name: `${customer.firstName} ${customer.lastName}`,
          cus_email: customer.email || "",
          amount: totalPrice, // তোমার হিসাব করা totalPrice
          metadata: {
            order_id: new ObjectId().toString(),
            user_id: user._id ? user._id : user,
          },
          redirect_url: `${process.env.FRONTEND_URL}/cart/checkout/payment-success`,
          cancel_url: `${process.env.FRONTEND_URL}/cart/checkout/payment-cancelled`,
          val_id: "INV-" + Date.now(),
          webhook_url: `${process.env.SERVER_URL}/zinpay/payment-webhook`,
        };

        console.log(payload);

        const data = await ziniPayCreatePayment(
          payload,
          process.env.ZINIPAY_API_KEY,
        );

        if (data?.payment_url) {
          return res.json({ success: true, paymentUrl: data.payment_url });
        } else {
          return res.status(400).json({
            success: false,
            message: "Payment URL not found",
            error: data,
          });
        }
      } catch (err) {
        console.error("Payment create error:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Payment session creation failed" });
      }
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllOrderData = async (req, res) => {
  try {
    const orderData = await orderCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const userData = await userCollection.find({}).toArray();

    const orders = orderData.map((order) => {
      const user = userData.find(
        (u) => u._id.toString() === order.user.toString(),
      );
      if (user) {
        return { user, ...order };
      }
      return { ...order };
    });

    res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.query;

    const order = await orderCollection.findOne({ _id: new ObjectId(id) });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.products.forEach(async (product) => {
      const productData = await productCollection.findOne({
        _id: new ObjectId(product.productId),
      });
      const variantData = productData.variantDetails.map((variant) => {
        if (variant.color === product.color) {
          return {
            ...variant,
            sizes: variant.sizes.map((size) =>
              size.size === product.size
                ? { ...size, stock: size.stock + product.quantity }
                : size,
            ),
          };
        }
        return variant;
      });

      await productCollection.updateOne(
        { _id: new ObjectId(product.productId) },
        { $set: { variantDetails: variantData } },
      );
    });

    await orderCollection.deleteOne({ _id: new ObjectId(id) });
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
