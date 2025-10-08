// src/api.js
const BASE_URL = "/api"; // works both in dev (proxy) and production

export const getTokenHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`, // <-- backticks
});

// --- Feedback ---
export const submitFeedback = async (data) => {
  const res = await fetch(`${BASE_URL}/feedback`, { // <-- backticks
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(data),
  });
  return res.json();
};

// --- Groceries ---
export const fetchGroceries = async () => {
  const res = await fetch(`${BASE_URL}/groceries`, { // <-- backticks
    headers: getTokenHeader(),
  });
  return res.json();
};

export const addGrocery = async (item) => {
  const res = await fetch(`${BASE_URL}/groceries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(item),
  });
  return res.json();
};

export const updateGrocery = async (id, updates) => {
  const res = await fetch(`${BASE_URL}/groceries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(updates),
  });
  return res.json();
};

export const deleteGrocery = async (id) => {
  const res = await fetch(`${BASE_URL}/groceries/${id}`, {
    method: "DELETE",
    headers: getTokenHeader(),
  });
  return res.json();
};

// --- Meals ---
export const fetchMeals = async () => {
  const res = await fetch(`${BASE_URL}/meals`, {
    headers: getTokenHeader(),
  });
  return res.json();
};

export const fetchMealById = async (id) => {
  const res = await fetch(`${BASE_URL}/meals/${id}`, {
    headers: getTokenHeader(),
  });
  return res.json();
};

// --- Users/Friends ---
export const fetchFriends = async () => {
  const res = await fetch(`${BASE_URL}/friends`, {
    headers: getTokenHeader(),
  });
  return res.json();
};
 
