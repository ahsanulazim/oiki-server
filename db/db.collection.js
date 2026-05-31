import client from "../lib/db.js";

export const orderCollection = client.db("oiki_store").collection("orders");
export const userCollection = client.db("oiki_store").collection("users");
export const locationCollection = client
  .db("oiki_store")
  .collection("locations");
export const productCollection = client.db("oiki_store").collection("products");
