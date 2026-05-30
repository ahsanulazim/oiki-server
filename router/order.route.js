import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrderData,
  getOrderDetails,
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/createOrder", createOrder);
router.get("/getAllOrderData", getAllOrderData);
router.get("/getOrderDetails", getOrderDetails);
router.delete("/deleteOrder", deleteOrder);

export default router;
