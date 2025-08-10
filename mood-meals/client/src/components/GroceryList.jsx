import React from "react";
import "../styles/GroceryList.css";
import broccoli from "../assets/groceries/broccoli.jpg";
import tomatoes from "../assets/groceries/tomatoes.jpg";
import chicken from "../assets/groceries/chicken.jpg";

const groceryItems = [
  { name: "Broccoli", qty: "2 units", img: broccoli },
  { name: "Tomatoes", qty: "5 units", img: tomatoes },
  { name: "Chicken Breast", qty: "1 unit", img: chicken },
];

const GroceryList = () => {
  return (
    <div className="grocery-list">
      <button className="primary-btn">Add New Item</button>
      <ul>
        {groceryItems.map((item, i) => (
          <li key={i}>
            <img src={item.img} alt={item.name} />
            <span>{item.name}</span>
            <span className="qty">{item.qty}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList;
