import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "../router/user.route.js";
import attributeRouter from "../router/attribute.route.js";
import variationRouter from "../router/variation.route.js";
import productRouter from "../router/product.route.js";
import locationRouter from "../router/location.route.js";
import shippingRatesRouter from "../router/shipping.route.js";
import orderRouter from "../router/order.route.js";
import zinpayRouter from "../router/zinpay.route.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://oiki-frontend.vercel.app",
      "https://oiki.store",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/attributes", attributeRouter);
app.use("/api/v1/variations", variationRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/shippingRates", shippingRatesRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/zinpay", zinpayRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
