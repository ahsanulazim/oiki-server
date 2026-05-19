import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductBySlug,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/createProduct", createProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/getProductBySlug/:slug", getProductBySlug);

export default router;
