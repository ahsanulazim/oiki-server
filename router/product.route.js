import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getCategoryFilters,
  getNewArriavals,
  getProductBySlug,
  getProductsByFilters,
} from "../controller/product.controller.js";

const router = express.Router();

router.post("/createProduct", createProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/getProductBySlug", getProductBySlug);
router.get("/getProductsByFilters", getProductsByFilters);
router.get("/getNewArrivals", getNewArriavals);
router.get("/getCategoryFIlters", getCategoryFilters);
router.delete("/deleteProduct", deleteProduct);

export default router;
