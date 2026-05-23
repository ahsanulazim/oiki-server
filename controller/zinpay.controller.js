import { ObjectId } from "mongodb";
import client from "../lib/db.js";
import dotenv from "dotenv";
dotenv.config();

const orderCollection = client.db("oiki_store").collection("orders");

export const paymentVerify = async (req, res) => {
  const { invoice_id, metadata } = req.body;

  try {
    const verifyData = await ziniPayVerifyPayment(
      invoice_id,
      process.env.ZINIPAY_API_KEY,
    );

    if (verifyData.status === "COMPLETED") {
      // ✅ Order save করো
      const order = {
        _id: new ObjectId(metadata.order_id),
        user: metadata.user_id,
        customer: {
          name: verifyData.cus_name,
          email: verifyData.cus_email,
        },
        subtotal: verifyData.amount,
        totalPrice: verifyData.amount,
        paymentMethod: verifyData.payment_method,
        transactionId: verifyData.transaction_id,
        invoiceId: verifyData.invoice_id,
        status: "paid",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await orderCollection.insertOne(order);
      return res.json({
        success: true,
        message: "Order saved after payment verification",
      });
    }

    return res
      .status(400)
      .json({ success: false, message: "Payment not completed", verifyData });
  } catch (err) {
    console.error("Verify error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
};

export async function ziniPayCreatePayment(payload, apiKey) {
  try {
    const response = await fetch("https://api.zinipay.com/v1/payment/create", {
      method: "POST",
      headers: {
        "zini-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Payment create failed");
    }

    return await response.json();
  } catch (e) {
    console.error("Create Payment Error:", e.message);
    throw e;
  }
}

export async function ziniPayVerifyPayment(invoiceId, apiKey) {
  try {
    const response = await fetch("https://api.zinipay.com/v1/payment/verify", {
      method: "POST",
      headers: {
        "zini-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ invoiceId }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || "Payment verify failed");
    }

    return await response.json();
  } catch (e) {
    console.error("Verify Payment Error:", e.message);
    throw e;
  }
}
