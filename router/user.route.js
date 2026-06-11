import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
} from "../controller/user.controller.js";

const router = express.Router();

// Example route for creating a user
router.post("/createUser", createUser);
router.get("/getUser", getUser);
router.delete("/deleteUser", deleteUser);

export default router;
