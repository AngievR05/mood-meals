// src/components/GrocerySection.jsx
import React, { useState, useEffect } from "react";
import "../styles/GrocerySection.css";

const GrocerySection = () => {
  const [input, setInput] = useState("");
  const [toBuy, setToBuy] = useState([]);
  const [owned, setOwned] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch groceries from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/groceries", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setToBuy(data.filter((g) => !g.owned));
        setOwned(data.filter((g) => g.owned));
      })
      .catch((err) => console.error("Error fetching groceries:", err));
  }, [token]);

  // Add grocery item
  const addGrocery = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    fetch("http://localhost:5000/api/groceries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: trimmed, quantity: "1 unit", owned: false }),
    })
      .then((res) => res.json())
      .then((newItem) => {
        setToBuy([...toBuy, newItem]);
        setInput("");
      })
      .catch((err) => console.error("Error adding grocery:", err));
  };

  // Mark as owned
  const handleCheckOff = (item) => {
    fetch(`http://localhost:5000/api/groceries/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...item, owned: true }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setToBuy(toBuy.filter((g) => g.id !== item.id));
        setOwned([...owned, updated]);
      })
      .catch((err) => console.error("Error updating grocery:", err));
  };

  // Delete grocery item
  const handleDelete = (id, ownedItem = false) => {
    fetch(`http://localhost:5000/api/groceries/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        if (ownedItem) {
          setOwned(owned.filter((g) => g.id !== id));
        } else {
          setToBuy(toBuy.filter((g) => g.id !== id));
        }
      })
      .catch((err) => console.error("Error deleting grocery:", err));
  };

  return (
    <div className="grocery-section">
      <h2> Grocery Tracker</h2>

      <div className="grocery-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addGrocery()}
          placeholder="e.g., Avocados"
        />
        <button onClick={addGrocery}>Add</button>
      </div>

      <div className="grocery-lists">
        <div className="grocery-column">
          <h3>To Buy</h3>
          <ul className="grocery-list to-buy">
            {toBuy.map((item) => (
              <li key={item.id}>
                <span onClick={() => handleCheckOff(item)}>{item.name}</span>
                <span className="qty">{item.quantity}</span>
                <span
                  className="delete-icon"
                  onClick={() => handleDelete(item.id, false)}
                >
                  ❌
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grocery-column">
          <h3>You Have</h3>
          <ul className="grocery-list owned">
            {owned.map((item) => (
              <li key={item.id} className="checked">
                {item.name} <span className="qty">{item.quantity}</span>
                <span
                  className="delete-icon"
                  onClick={() => handleDelete(item.id, true)}
                >
                  ❌
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GrocerySection;
