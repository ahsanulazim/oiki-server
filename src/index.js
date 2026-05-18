import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "../router/user.route.js";
import variantsRouter from "../router/variant.route.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/variants", variantsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
