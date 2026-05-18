import express from "express";
import {
  addAVariant,
  createVariant,
  deleteVariant,
  getAllAttributes,
  getAllVariants,
  getVariantBySlug,
} from "../controller/variant.controller.js";

const router = express.Router();

router.post("/createVariant", createVariant);
router.post("/addAVariant", addAVariant);
router.get("/getAllAttributes", getAllAttributes);
router.get("/getAllVariants", getAllVariants);
router.get("/getAVariant/:slug", getVariantBySlug);
router.delete("/deleteVariant/:id", deleteVariant);

export default router;
