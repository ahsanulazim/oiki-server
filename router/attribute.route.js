import express from "express";
import {
  createAttribute,
  deleteAttribute,
  getAllAttribute,
} from "../controller/attribute.controller.js";

const router = express.Router();

router.get("/getAllAttributes", getAllAttribute);
router.post("/createAttribute", createAttribute);
router.delete("/deleteAttribute", deleteAttribute);

export default router;
