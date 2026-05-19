import express from "express";
import {
  createProduct,
  getAllProducts,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/createProduct", createProduct);
router.get("/getAllProducts", getAllProducts);

export default router;
