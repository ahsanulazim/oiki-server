import { ObjectId } from "mongodb";
import client from "../lib/db.js";

const orderCollection = client.db("oiki_store").collection("orders");

export const paymentVerify = async (req, res) => {
  const {
    orderId,
    status,
    customer,
    products,
    shippingCharge,
    subtotal,
    totalPrice,
    user,
  } = req.body;

  if (status === "success") {
    const order = {
      _id: new ObjectId(orderId),
      customer,
      products,
      shippingCharge,
      subtotal,
      totalPrice,
      user,
      paymentMethod: "Online",
      status: "Paid",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await orderCollection.insertOne(order);
  }

  res.json({ success: true });
};
