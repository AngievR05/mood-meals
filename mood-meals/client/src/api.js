// src/api.js

const BASE_URL = "/api"; // Works both in dev (proxy) and production

// --- Auth Header Helper ---
export const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Feedback ---
export const submitFeedback = async (data) => {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit feedback");
  return res.json();
};

// --- Groceries ---
export const fetchGroceries = async () => {
  const res = await fetch(`${BASE_URL}/groceries`, {
    headers: getTokenHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch groceries");
  return res.json();
};

export const addGrocery = async (item) => {
  const res = await fetch(`${BASE_URL}/groceries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to add grocery item");
  return res.json();
};

export const updateGrocery = async (id, updates) => {
  const res = await fetch(`${BASE_URL}/groceries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update grocery item");
  return res.json();
};

export const deleteGrocery = async (id) => {
  const res = await fetch(`${BASE_URL}/groceries/${id}`, {
    method: "DELETE",
    headers: getTokenHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete grocery item");
  return res.json();
};

// --- Meals ---
export const fetchMeals = async () => {
  const res = await fetch(`${BASE_URL}/meals`, {
    headers: getTokenHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch meals");
  return res.json();
};

export const fetchMealById = async (id) => {
  const res = await fetch(`${BASE_URL}/meals/${id}`, {
    headers: getTokenHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch meal details");
  return res.json();
};

// --- Users / Friends ---
export const fetchFriends = async () => {
  const res = await fetch(`${BASE_URL}/friends`, {
    headers: getTokenHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch friends");
  return res.json();
};
