import React, { useState } from 'react';
import '../styles/GrocerySection.css';

const GrocerySection = () => {
  const [input, setInput] = useState('');
  const [groceries, setGroceries] = useState([]);

  const addGrocery = () => {
    if (input.trim() !== '') {
      setGroceries([...groceries, input]);
      setInput('');
    }
  };

  return (
    <div className="grocery-section">
      <h2>🛒 Add Groceries</h2>
      <div className="grocery-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Broccoli"
        />
        <button onClick={addGrocery}>Add</button>
      </div>
      <ul className="grocery-list">
        {groceries.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default GrocerySection;
