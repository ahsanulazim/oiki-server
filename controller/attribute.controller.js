import { ObjectId } from "mongodb";
import client from "../lib/db.js";

const attributeCollection = client.db("oiki_store").collection("attributes");
await attributeCollection.createIndex({ slug: 1 }, { unique: true });

export const createAttribute = async (req, res) => {
  const { name, slug, attributeType } = req.body;

  if (!name || !slug || !attributeType) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const createdAt = new Date();
  const updatedAt = new Date();

  const newAttribute = {
    name,
    slug,
    attributeType,
    createdAt,
    updatedAt,
  };

  try {
    await attributeCollection.insertOne(newAttribute);
    res
      .status(201)
      .json({ success: true, message: "Attribute created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Attribute creation Failed" });
  }
};

export const getAllAttribute = async (req, res) => {
  try {
    const attributes = await attributeCollection.find().toArray();

    res.status(200).json(attributes);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Attributes finding Failed" });
  }
};

export const deleteAttribute = async (req, res) => {
  const { id } = req.query;

  try {
    await attributeCollection.deleteOne({ _id: new ObjectId(id) });
    res
      .status(200)
      .json({ success: true, message: "Attribute deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Attribute deletion Failed" });
  }
};
