import cloudinary from "../lib/cloudinary.js";
import client from "../lib/db.js";

const productCollection = client.db("oiki_store").collection("products");
await productCollection.createIndex({ slug: 1 }, { unique: true });

export const createProduct = async (req, res) => {
  const {
    productName,
    slug,
    color,
    stock,
    productDescription,
    price,
    discount,
    category,
    productImages,
    variants,
    size,
    sku,
    variantDetails,
  } = req.body;

  if (!productName || !slug || !productDescription || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let uploadedImageUrls = [];

  if (productImages && Array.isArray(productImages)) {
    uploadedImageUrls = await Promise.all(
      productImages.map(async (image) => {
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        return uploadRes?.secure_url || "";
      }),
    );
  }

  if (variantDetails && Array.isArray(variantDetails)) {
    await Promise.all(
      variantDetails.map(async (variant) => {
        if (variant.image) {
          const uploadRes = await cloudinary.uploader.upload(variant.image, {
            folder: "products",
          });
          variant.image = uploadRes?.secure_url || "";
        }
      }),
    );
  }

  const createdAt = new Date();
  const updatedAt = new Date();

  const product = {
    productName,
    slug,
    color,
    stock,
    category,
    productDescription,
    price,
    discount,
    productImages: uploadedImageUrls,
    variants,
    size,
    sku,
    variantDetails,
    createdAt,
    updatedAt,
  };

  try {
    await productCollection.insertOne(product);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productCollection.find().toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductBySlug = async (req, res) => {
  const { slug } = req.query;

  try {
    const product = await productCollection.findOne({ slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
