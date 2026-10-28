import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initSocket } from "../lib/socket.js";
import userRouter from "../router/user.route.js";
import attributeRouter from "../router/attribute.route.js";
import variationRouter from "../router/variation.route.js";
import productRouter from "../router/product.route.js";
import locationRouter from "../router/location.route.js";
import shippingRatesRouter from "../router/shipping.route.js";
import orderRouter from "../router/order.route.js";
import zinpayRouter from "../router/zinpay.route.js";
import categoryRouter from "../router/category.route.js";
import couponRouter from "../router/coupon.route.js";
import reviewRouter from "../router/review.route.js";

const app = express();
const server = http.createServer(app);
dotenv.config();

// Initialize Socket.IO
initSocket(server);

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

const PORT = process.env.PORT || 5000;

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
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/reviews", reviewRouter);

server.listen(PORT, () => {
  console.log(`Server & Socket.IO running on port ${PORT}`);
});
