import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/GrocerySection.css";

const moodHints = {
  Happy: ["🍓 Add something sweet!", "🥗 Keep it colorful!"],
  Sad: ["🍫 Chocolate can help!", "🥛 Milk for comfort"],
  Angry: ["🌶️ Spice it up!", "🍌 Potassium-rich bananas"],
  Stressed: ["🥑 Avocado for calm", "🍵 Green tea vibes"],
  Bored: ["🍇 Try new fruits!", "🥪 Make a sandwich masterpiece"],
  Energised: ["💪 Protein boost!", "🥕 Carrot sticks for crunch"],
  Confused: ["🥗 Simple salad?", "🍝 Pasta is always a choice"],
  Grateful: ["🍯 Honey for sweetness", "🍉 Refreshing watermelon"],
};

const GrocerySection = ({ currentMood }) => {
  const [input, setInput] = useState("");
  const [toBuy, setToBuy] = useState([]);
  const [bought, setBought] = useState([]);
  const [hint, setHint] = useState("");

  const token = localStorage.getItem("token");

  // Fetch groceries on mount
  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/groceries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setToBuy(data.filter((g) => g.purchased === 0));
        setBought(data.filter((g) => g.purchased === 1));
      } catch (err) {
        console.error(err);
        toast.error("⚠️ Failed to load groceries.");
      }
    };
    fetchGroceries();
  }, [token]);

  // Mood hint
  useEffect(() => {
    if (currentMood && moodHints[currentMood]) {
      const hints = moodHints[currentMood];
      setHint(hints[Math.floor(Math.random() * hints.length)]);
    }
  }, [currentMood]);

  const addItem = async () => {
    if (!input.trim()) return toast.warn("📝 Please enter an item name.");
    try {
      const res = await fetch("http://localhost:5000/api/groceries", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ item_name: input, quantity: "1" }),
      });
      const newItem = await res.json();
      setToBuy([...toBuy, newItem]);
      setInput("");
      toast.success("✅ Item added to list!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add item.");
    }
  };

  const handleDelete = async (item, isBought) => {
    try {
      await fetch(`http://localhost:5000/api/groceries/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (isBought) setBought(bought.filter((i) => i.id !== item.id));
      else setToBuy(toBuy.filter((i) => i.id !== item.id));
      toast.info(`🗑️ Deleted "${item.item_name}"`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Could not delete item.");
    }
  };

  const toggleBought = async (item, isBought) => {
    try {
      const updatedItem = await fetch(`http://localhost:5000/api/groceries/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...item, purchased: isBought ? 0 : 1 }),
      }).then((r) => r.json());

      if (isBought) {
        setBought(bought.filter((i) => i.id !== item.id));
        setToBuy([...toBuy, updatedItem]);
        toast.info(`↩️ Moved "${item.item_name}" back to To Buy.`);
      } else {
        setToBuy(toBuy.filter((i) => i.id !== item.id));
        setBought([...bought, updatedItem]);
        toast.success(`✔️ Marked "${item.item_name}" as bought!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Could not update item.");
    }
  };

  const handleQtyChange = async (item, value, isBought) => {
    if (!value) return;
    try {
      const updated = await fetch(`http://localhost:5000/api/groceries/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...item, quantity: value }),
      }).then((r) => r.json());

      if (isBought) setBought(bought.map((i) => (i.id === item.id ? updated : i)));
      else setToBuy(toBuy.map((i) => (i.id === item.id ? updated : i)));
      toast.info(`🔢 Updated "${item.item_name}" quantity to ${value}.`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update quantity.");
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = source.droppableId === "toBuy" ? Array.from(toBuy) : Array.from(bought);
    const destList = destination.droppableId === "toBuy" ? Array.from(toBuy) : Array.from(bought);
    const [moved] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, moved);

    if (source.droppableId === "toBuy") setToBuy(sourceList);
    else setBought(sourceList);

    if (destination.droppableId === "toBuy") setToBuy(destList);
    else setBought(destList);

    if (source.droppableId !== destination.droppableId) {
      toggleBought(moved, source.droppableId === "bought");
    }
  };

  return (
    <div className="grocery-section">
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar theme="colored" />

      <h2>🛒 Grocery List</h2>
      {hint && <p className="mood-hint">{hint}</p>}

      <div className="grocery-input">
        <input
          type="text"
          placeholder="Add an item..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <button onClick={addItem}>Add</button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grocery-lists">
          {["toBuy", "bought"].map((listName) => (
            <Droppable droppableId={listName} key={listName}>
              {(provided) => {
                const list = listName === "toBuy" ? toBuy : bought;
                return (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="grocery-column">
                    <h3>{listName === "toBuy" ? "To Buy" : "Bought"}</h3>
                    <ul className="grocery-list">
                      {list.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={listName === "bought" ? "checked" : ""}
                            >
                              <span>{item.item_name}</span>
                              <div className="qty-controls">
                                <button onClick={() => handleQtyChange(item, (parseInt(item.quantity) || 1) - 1, listName === "bought")}>-</button>
                                <input
                                  className="qty-input"
                                  value={item.quantity}
                                  onChange={(e) => handleQtyChange(item, e.target.value, listName === "bought")}
                                />
                                <button onClick={() => handleQtyChange(item, (parseInt(item.quantity) || 1) + 1, listName === "bought")}>+</button>
                              </div>
                              <button className="toggle-btn" onClick={() => toggleBought(item, listName === "bought")}>
                                {listName === "bought" ? "↩️" : "✔️"}
                              </button>
                              <span className="delete-icon" onClick={() => handleDelete(item, listName === "bought")}>❌</span>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {list.length === 0 && <li className="empty-msg">No items here!</li>}
                    </ul>
                  </div>
                );
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default GrocerySection;
