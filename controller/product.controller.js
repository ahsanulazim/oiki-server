import { ObjectId } from "mongodb";
import cloudinary from "../lib/cloudinary.js";
import client from "../lib/db.js";
import { productCollection } from "../db/db.collection.js";

export const createProduct = async (req, res) => {
  const {
    productName,
    slug,
    stock,
    productDescription,
    price,
    discount,
    category,
    productImages,
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
        if (variant.imageGallery && Array.isArray(variant.imageGallery)) {
          const uploadedGallery = await Promise.all(
            variant.imageGallery.map(async (img) => {
              const uploadRes = await cloudinary.uploader.upload(img, {
                folder: "products",
              });
              return uploadRes?.secure_url || "";
            }),
          );
          variant.imageGallery = uploadedGallery;
        }
        if (variant.swatchImage) {
          const uploadRes = await cloudinary.uploader.upload(
            variant.swatchImage,
            {
              folder: "products",
            },
          );
          variant.swatchImage = uploadRes?.secure_url || "";
        }
      }),
    );
  }

  const createdAt = new Date();
  const updatedAt = new Date();

  const product = {
    productName,
    slug,
    stock,
    category,
    productDescription,
    price,
    discount,
    productImages: uploadedImageUrls,
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

export const getProductsByCategory = async (req, res) => {
  const { category } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 20);
  const skip = (page - 1) * limit;

  try {
    const products = await productCollection
      .find({ category })
      .skip(skip)
      .limit(limit)
      .toArray();

    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }

    const totalProducts = await productCollection.countDocuments();
    res
      .status(200)
      .json({
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        hasNext: page * limit < totalProducts,
        hasPrev: page > 1,
        start: skip + 1,
        end: Math.min(skip + limit, totalProducts),
      });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNewArriavals = async (req, res) => {
  try {
    const newArriavals = await productCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();
    res.status(200).json(newArriavals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.query;
  try {
    const product = await productCollection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      res.status(404).json({ success: false, message: "Product not Found!" });
    }

    if (product.productImages && Array.isArray(product.productImages)) {
      await Promise.all(
        product.productImages.map(async (image) => {
          const deleteImage = image.split("/").pop().split(".");
          try {
            await cloudinary.uploader.destroy(`/products/${deleteImage}`);
            console.log("Deleted Image from Cloudinary");
          } catch (error) {
            console.error("Error Deleting Image", error);
          }
        }),
      );
    }

    await productCollection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true, message: "Product Deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete Product" });
  }
};

export const getCategoryFilters = async (req, res) => {
  const { category } = req.query;
  try {
    const pipeline = [
      { $match: { category } },
      {
        $group: {
          _id: null,
          minPrice: { $min: { $toInt: "$price" } },
          maxPrice: { $max: { $toInt: "$price" } },
          colors: { $addToSet: "$variantDetails.color" },
          sizes: { $addToSet: "$variantDetails.sizes.size" },
        },
      },
    ];

    const filter = await productCollection.aggregate(pipeline).toArray();
    res.json(filter[0]);
  } catch (error) {
    res.status(500).json({ message: "FIlters error" });
  }
};
