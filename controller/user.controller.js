import client from "../lib/db.js";

const userCollection = client.db("oiki_store").collection("users");
await userCollection.createIndex({ email: 1 }, { unique: true });

export const createUser = async (req, res) => {
  const { name, email } = req.body;

  console.log(name, email);

  const role = "user";
  const createdAt = new Date();
  const updatedAt = new Date();

  const newUser = {
    name,
    email,
    role,
    createdAt,
    updatedAt,
  };

  // Validate input
  if (!name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Name and email are required" });
  }

  try {
    await userCollection.insertOne(newUser);
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    res.status(500).json({ success: false, message: "Error creating user" });
  }
};

export const getUser = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
};

export const deleteUser = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const result = await userCollection.deleteOne({ email });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};
