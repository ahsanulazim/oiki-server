import express from "express";
import {
  createShippingRate,
  deleteShippingRate,
  getAllShippingRates,
} from "../controller/shipping.controller.js";

const router = express.Router();

router.post("/createShippingRate", createShippingRate);
router.get("/getAllShippingRates", getAllShippingRates);
router.delete("/deleteShippingRate", deleteShippingRate);

export default router;
