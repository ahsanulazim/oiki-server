import { ObjectId } from "mongodb";
import client from "../lib/db.js";

const orderCollection = client.db("oiki_store").collection("orders");
const productCollection = client.db("oiki_store").collection("products");
const shippingRateCollection = client
  .db("oiki_store")
  .collection("shipping_rates");

export const createOrder = async (req, res) => {
  const { customer, products, user } = req.body;

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
        image: productData.productImages,
      });
    }

    // 3. Total হিসাব করো
    const subtotal = orderProducts.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0,
    );
    const totalPrice = subtotal + shippingCharge;

    // 4. Order বানাও
    const order = {
      user: user._id ? user._id : user,
      customer,
      products: orderProducts,
      shippingCharge,
      subtotal,
      totalPrice,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await orderCollection.insertOne(order);

    res
      .status(201)
      .json({ success: true, message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllOrderData = async (req, res) => {
  try {
    const orders = await orderCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
