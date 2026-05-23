import express from "express";
import {
  createOrder,
  getAllOrderData,
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/createOrder", createOrder);
router.get("/getAllOrderData", getAllOrderData);

export default router;
