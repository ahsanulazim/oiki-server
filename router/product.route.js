import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getNewArriavals,
  getProductBySlug,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/createProduct", createProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/getProductBySlug", getProductBySlug);
router.get("/getNewArrivals", getNewArriavals);
router.delete("/deleteProduct", deleteProduct);

export default router;
