import client from "../lib/db.js";

export const orderCollection = client.db("oiki_store").collection("orders");
export const userCollection = client.db("oiki_store").collection("users");
