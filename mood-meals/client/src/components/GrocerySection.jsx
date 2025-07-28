import React, { useState } from 'react';
import '../styles/GrocerySection.css';

const GrocerySection = () => {
  const [input, setInput] = useState('');
  const [toBuy, setToBuy] = useState([]);
  const [owned, setOwned] = useState([]);

  const addGrocery = () => {
    const trimmed = input.trim();
    if (trimmed !== '') {
      setToBuy([...toBuy, trimmed]);
      setInput('');
    }
  };

  const handleCheckOff = (item) => {
    setToBuy(toBuy.filter((g) => g !== item));
    setOwned([...owned, item]);
  };

  return (
    <div className="grocery-section">
      <h2>🛒 Grocery Tracker</h2>
      <div className="grocery-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addGrocery();
          }}
          placeholder="e.g., Avocados"
        />
        <button onClick={addGrocery}>Add</button>
      </div>
      <div className="grocery-lists">
        <div className="grocery-column">
          <h3>To Buy</h3>
          <ul className="grocery-list to-buy">
            {toBuy.map((item, idx) => (
              <li key={idx} onClick={() => handleCheckOff(item)}>
                <span>{item}</span>
                <span className="check-icon">✔</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grocery-column">
          <h3>You Have</h3>
          <ul className="grocery-list owned">
            {owned.map((item, idx) => (
              <li key={idx} className="checked">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GrocerySection;
