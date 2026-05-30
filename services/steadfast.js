import dotenv from "dotenv";
dotenv.config();

const steadFastApiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${process.env.STEADFAST_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.STEADFAST_API_KEY,
      "Secret-Key": process.env.STEADFAST_SECRET_KEY,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

// ✅ Create Order
export const createOrder = async (orderData) => {
  return steadFastApiFetch("/create-order", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

// ✅ Check Balance
export const checkBalance = async () => {
  return steadFastApiFetch("/balance", { method: "GET" });
};

// ✅ Track Order
export const trackOrder = async (trackingId) => {
  return steadFastApiFetch(`/track/${trackingId}`, { method: "GET" });
};
