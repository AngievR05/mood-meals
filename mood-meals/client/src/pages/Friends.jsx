import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Friends.css";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState("");

  const fetchFriends = async () => {
    try {
      const res = await axios.get("/api/friends", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFriends(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addFriend = async () => {
    if (!newFriend) return;
    try {
      await axios.post(
        "/api/friends",
        { friendEmail: newFriend },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewFriend("");
      fetchFriends(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.error || "Error adding friend");
    }
  };

  const removeFriend = async (id) => {
    try {
      await axios.delete(`/api/friends/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchFriends(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="friends-page">
      <section className="connect-section card">
        <h2>Connect with Friends</h2>
        <div className="friend-input">
          <input
            type="email"
            placeholder="Add Friend by Email..."
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
          />
          <button onClick={addFriend}>Add Friend</button>
        </div>
      </section>

      <section className="friends-section">
        <h2>Your Friends</h2>
        <div className="friends-list">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-card">
              <div className="emoji-placeholder">😊</div>
              <h3>{friend.username}</h3>
              <p>Mood: {friend.mood || "No recent mood"}</p>
              <p>Last Meal: {friend.last_meal || "No meal logged"}</p>
              <button onClick={() => removeFriend(friend.id)}>Remove</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Friends;
