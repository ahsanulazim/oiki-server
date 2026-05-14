import express from "express";
import { createUser, getUser } from "../controller/user.controller.js";

const router = express.Router();

// Example route for creating a user
router.post("/createUser", createUser);
router.get("/getUser", getUser);

export default router;
