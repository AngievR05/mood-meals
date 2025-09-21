import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../styles/GrocerySection.css";

const GrocerySection = () => {
  const [input, setInput] = useState("");
  const [toBuy, setToBuy] = useState([]);
  const [bought, setBought] = useState([]);

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
      }
    };
    fetchGroceries();
  }, [token]);

  // Add new grocery
  const addItem = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/groceries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_name: input, quantity: "1 unit" }),
      });
      const newItem = await res.json();
      setToBuy([...toBuy, newItem]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete grocery
  const handleDelete = async (item, isBought) => {
    try {
      await fetch(`http://localhost:5000/api/groceries/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (isBought) setBought(bought.filter((i) => i.id !== item.id));
      else setToBuy(toBuy.filter((i) => i.id !== item.id));
    } catch (err) {
      console.error(err);
    }
  };

  // Update purchased status or quantity
  const updateItem = async (item, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/groceries/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...item, ...updatedFields }),
      });
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle drag and drop
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

    // Update purchased if moved across lists
    if (source.droppableId !== destination.droppableId) {
      updateItem(moved, { purchased: destination.droppableId === "bought" ? 1 : 0 });
    }
  };

  // Handle quantity change
  const handleQtyChange = async (item, value, isBought) => {
    if (!value) return;
    const updated = await updateItem(item, { quantity: value });
    if (isBought) {
    setBought(bought.map((i) => (i.id === item.id ? updated : i)));
  } else {
    setToBuy(toBuy.map((i) => (i.id === item.id ? updated : i)));
  }
  };


  return (
    <div className="grocery-section">
      <h2>🛒 Grocery List</h2>
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
          {/* To Buy */}
          <Droppable droppableId="toBuy">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="grocery-column">
                <h3>To Buy</h3>
                <ul className="grocery-list">
                  {toBuy.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <span>{item.item_name}</span>
                          <input
                            className="qty-input"
                            value={item.quantity}
                            onChange={(e) => handleQtyChange(item, e.target.value, false)}
                          />
                          <span className="delete-icon" onClick={() => handleDelete(item, false)}>❌</span>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>

          {/* Bought */}
          <Droppable droppableId="bought">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="grocery-column">
                <h3>Bought</h3>
                <ul className="grocery-list">
                  {bought.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="checked">
                          <span>{item.item_name}</span>
                          <input
                            className="qty-input"
                            value={item.quantity}
                            onChange={(e) => handleQtyChange(item, e.target.value, true)}
                          />
                          <span className="delete-icon" onClick={() => handleDelete(item, true)}>❌</span>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default GrocerySection;
