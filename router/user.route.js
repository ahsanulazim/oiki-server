import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controller/user.controller.js";

const router = express.Router();

// Example route for creating a user
router.post("/createUser", createUser);
router.get("/getUser", getUser);
router.delete("/deleteUser", deleteUser);
router.put("/updateUser", updateUser);

export default router;
