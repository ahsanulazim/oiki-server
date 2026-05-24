import express from "express";
import {
  paymentVerify,
  ziniPayCreatePayment,
  ziniPayVerifyPayment,
} from "../controller/zinpay.controller.js";

const router = express.Router();

//router.post("/payment-webhook", paymentVerify);
router.post("ziniPayCreatePayment", ziniPayCreatePayment);
router.post("ziniPayVerifyPayment", ziniPayVerifyPayment);
router.post("/payment-webhook", paymentVerify);

export default router;
