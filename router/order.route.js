import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrderData,
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/createOrder", createOrder);
router.get("/getAllOrderData", getAllOrderData);
router.delete("/deleteOrder", deleteOrder);

export default router;
