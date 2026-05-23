import client from "../lib/db.js";

const locationCollection = client.db("oiki_store").collection("locations");

export const getAllLocations = async (req, res) => {
  try {
    const locations = await locationCollection.find().toArray();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: "Failed to get locations" });
  }
};
