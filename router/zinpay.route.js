import express from "express";
import { paymentVerify } from "../controller/zinpay.controller.js";

const router = express.Router();

router.post("/payment-webhook", paymentVerify);

export default router;
