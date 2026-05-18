import { ObjectId } from "mongodb";
import client from "../lib/db.js";

const variantCollection = client.db("oiki_store").collection("variants");
await variantCollection.createIndex({ name: 1 }, { unique: true });
const attributeCollection = client.db("oiki_store").collection("attributes");
await attributeCollection.createIndex({ variantSlug: 1 }, { unique: true });

export const createVariant = async (req, res) => {
  const { name, type } = req.body;
  const createdAt = new Date();
  const updatedAt = new Date();

  const newVariant = {
    name,
    type,
    createdAt,
    updatedAt,
  };

  try {
    await variantCollection.insertOne(newVariant);
    res
      .status(201)
      .json({ success: true, message: "Variant created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating variant" });
  }
};

export const getAllVariants = async (req, res) => {
  try {
    const variants = await variantCollection.find().toArray();
    res.status(200).json({ success: true, data: variants });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching variants" });
  }
};

export const getVariantBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const variant = await variantCollection.findOne({ slug });
    if (!variant) {
      return res
        .status(404)
        .json({ success: false, message: "Variant not found" });
    }
    res.status(200).json({ success: true, data: variant });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching variant" });
  }
};

export const deleteVariant = async (req, res) => {
  const { id } = req.params;

  try {
    await variantCollection.deleteOne({ _id: new ObjectId(id) });
    res
      .status(200)
      .json({ success: true, message: "Variant deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting variant" });
  }
};

export const addAVariant = async (req, res) => {
  const { slug } = req.query;
  const { data } = req.body;
  const { name, attribute, variantSlug } = data;
  const createdAt = new Date();
  const updatedAt = new Date();

  const newAttribute = {
    name,
    variantSlug,
    slug,
    attribute,
    createdAt,
    updatedAt,
  };

  try {
    await attributeCollection.insertOne(newAttribute);
    res
      .status(201)
      .json({ success: true, message: "Attribute added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding attribute" });
  }
};

export const getAllAttributes = async (req, res) => {
  const { slug } = req.query;

  try {
    const attributes = await attributeCollection.find({ slug }).toArray();
    res.status(200).json({ success: true, data: attributes });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching attributes" });
  }
};
