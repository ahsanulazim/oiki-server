import client from "../lib/db.js";

export const orderCollection = client.db("oiki_store").collection("orders");
export const userCollection = client.db("oiki_store").collection("users");
export const locationCollection = client
  .db("oiki_store")
  .collection("locations");
export const productCollection = client.db("oiki_store").collection("products");
await productCollection.createIndex({ slug: 1 }, { unique: true });
export const categoryCollection = client
  .db("oiki_store")
  .collection("categories");
await categoryCollection.createIndex({ slug: 1 }, { unique: true });
