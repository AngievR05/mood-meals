// src/components/GrocerySection.jsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/GrocerySection.css";
import {
  fetchGroceries,
  addGrocery,
  updateGrocery,
  deleteGrocery,
} from "../api"; // ✅ API functions

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

  // --- Fetch groceries on mount (runs ONCE) ---
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGroceries();
        setToBuy(data.filter((g) => g.purchased === 0));
        setBought(data.filter((g) => g.purchased === 1));
      } catch (err) {
        console.error(err);
        toast.error("⚠️ Failed to load groceries.");
      }
    };
    load();
  }, []); // ✅ prevents infinite fetch loop

  // --- Set mood-based hint ---
  useEffect(() => {
    if (currentMood && moodHints[currentMood]) {
      const hints = moodHints[currentMood];
      setHint(hints[Math.floor(Math.random() * hints.length)]);
    }
  }, [currentMood]);

  // --- Add grocery ---
  const addItem = async () => {
    if (!input.trim()) return toast.warn("📝 Please enter an item name.");
    try {
      const newItem = await addGrocery({ item_name: input, quantity: "1" });
      setToBuy((prev) => [...prev, newItem]);
      setInput("");
      toast.success("✅ Item added to list!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add item.");
    }
  };

  // --- Delete grocery ---
  const handleDelete = async (item, isBought) => {
    try {
      await deleteGrocery(item.id);
      if (isBought)
        setBought((prev) => prev.filter((i) => i.id !== item.id));
      else setToBuy((prev) => prev.filter((i) => i.id !== item.id));
      toast.info(`🗑️ Deleted "${item.item_name}"`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Could not delete item.");
    }
  };

  // --- Toggle bought / unbought ---
  const toggleBought = async (item, isBought) => {
    try {
      const updated = await updateGrocery(item.id, {
        ...item,
        purchased: isBought ? 0 : 1,
      });

      if (isBought) {
        setBought((prev) => prev.filter((i) => i.id !== item.id));
        setToBuy((prev) => [...prev, updated]);
        toast.info(`↩️ Moved "${item.item_name}" back to To Buy.`);
      } else {
        setToBuy((prev) => prev.filter((i) => i.id !== item.id));
        setBought((prev) => [...prev, updated]);
        toast.success(`✔️ Marked "${item.item_name}" as bought!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Could not update item.");
    }
  };

  // --- Quantity change ---
  const handleQtyChange = async (item, value, isBought) => {
    if (!value) return;
    try {
      const updated = await updateGrocery(item.id, {
        ...item,
        quantity: value,
      });
      if (isBought)
        setBought((prev) =>
          prev.map((i) => (i.id === item.id ? updated : i))
        );
      else
        setToBuy((prev) =>
          prev.map((i) => (i.id === item.id ? updated : i))
        );
      toast.info(`🔢 Updated "${item.item_name}" quantity to ${value}.`);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update quantity.");
    }
  };

  // --- Drag & drop reorder ---
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList =
      source.droppableId === "toBuy" ? [...toBuy] : [...bought];
    const destList =
      destination.droppableId === "toBuy" ? [...toBuy] : [...bought];

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
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        theme="colored"
      />

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
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grocery-column"
                  >
                    <h3>{listName === "toBuy" ? "To Buy" : "Bought"}</h3>
                    <ul className="grocery-list">
                      {list.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={
                                listName === "bought" ? "checked" : ""
                              }
                            >
                              <span>{item.item_name}</span>
                              <div className="qty-controls">
                                <button
                                  onClick={() =>
                                    handleQtyChange(
                                      item,
                                      (parseInt(item.quantity) || 1) - 1,
                                      listName === "bought"
                                    )
                                  }
                                >
                                  -
                                </button>
                                <input
                                  className="qty-input"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQtyChange(
                                      item,
                                      e.target.value,
                                      listName === "bought"
                                    )
                                  }
                                />
                                <button
                                  onClick={() =>
                                    handleQtyChange(
                                      item,
                                      (parseInt(item.quantity) || 1) + 1,
                                      listName === "bought"
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <button
                                className="toggle-btn"
                                onClick={() =>
                                  toggleBought(item, listName === "bought")
                                }
                              >
                                {listName === "bought" ? "↩️" : "✔️"}
                              </button>
                              <span
                                className="delete-icon"
                                onClick={() =>
                                  handleDelete(item, listName === "bought")
                                }
                              >
                                ❌
                              </span>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {list.length === 0 && (
                        <li className="empty-msg">No items here!</li>
                      )}
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
