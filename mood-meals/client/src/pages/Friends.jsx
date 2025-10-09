// src/pages/Friends.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Friends.css";

const Friends = () => {
  const [friends, setFriends] = useState({
    pendingReceived: [],
    pendingSent: [],
    accepted: [],
  });
  const [newFriend, setNewFriend] = useState("");
  const [encourageMsgs, setEncourageMsgs] = useState({});
  const [snackbar, setSnackbar] = useState({ message: "", type: "" });
  const [activeTab, setActiveTab] = useState("pending"); // pending | accepted

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar({ message: "", type: "" }), 3000);
  };
const fetchFriends = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/friends`, {   // ✅ added /api
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const enhance = (list = []) =>
      list.map((f) => ({
        ...f,
        last_moods: f.latest_mood ? [{ mood: f.latest_mood, notes: f.mood_time }] : [],
        last_meals: f.last_meal ? [{ meal_name: f.last_meal }] : [],
        encouragements: f.encouragements || [],
      }));

    setFriends({
      pendingReceived: enhance(res.data?.pendingReceived || []),
      pendingSent: enhance(res.data?.pendingSent || []),
      accepted: enhance(res.data?.accepted || []),
    });
  } catch (err) {
    console.error(err);
    showSnackbar("Error fetching friends", "error");
  }
};

const addFriend = async () => {
  if (!newFriend.trim()) return showSnackbar("Enter username or email", "error");
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/friends/add`,   // ✅ fixed
      { friendIdentifier: newFriend },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    showSnackbar(res.data.message || "Friend request sent");
    setNewFriend("");
    fetchFriends();
  } catch (err) {
    showSnackbar(err.response?.data?.error || "Error sending friend request", "error");
  }
};

  const updateFriend = async (action, friendshipId, friendId) => {
    try {
      let res;
if (action === "accept") {
  res = await axios.post(
    `${BACKEND_URL}/api/friends/accept`,
    { friendshipId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
} else if (action === "reject") {
  res = await axios.post(
    `${BACKEND_URL}/api/friends/reject`,
    { friendshipId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
} else if (action === "remove") {
  res = await axios.delete(`${BACKEND_URL}/api/friends/${friendId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}
      showSnackbar(res?.data?.message || `${action} successful`);
      fetchFriends();
    } catch (err) {
      showSnackbar(err.response?.data?.error || `Error ${action} friend`, "error");
    }
  };

  const batchAction = async (action) => {
    const targets = friends.pendingReceived.map((f) => f.friendship_id);
    try {
      await Promise.all(targets.map((id) => updateFriend(action, id)));
      showSnackbar(`All ${action}ed successfully`);
    } catch {
      showSnackbar(`Error performing batch ${action}`, "error");
    }
  };

  const sendEncouragement = async (friendId) => {
    const message = encourageMsgs[friendId];
    if (!message?.trim()) return showSnackbar("Enter a message", "error");
    try {
const res = await axios.post(
  `${BACKEND_URL}/api/friends/encourage`,
  { receiverId: friendId, message },
  { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
);
      showSnackbar(res.data.message || "Encouragement sent");
      setEncourageMsgs((prev) => ({ ...prev, [friendId]: "" }));
      fetchFriends();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Error sending encouragement", "error");
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const { pendingReceived, pendingSent, accepted } = friends;
  const stats = { total: accepted.length, streaks: accepted.filter((f) => f.last_moods.length > 0).length };

  return (
    <div className="friends-page">
      {/* Add Friend */}
      <section className="connect-section card">
        <h2>Connect with Friends</h2>
        <div className="connect-inputs">
          <input
            type="text"
            placeholder="Add by username or email"
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
          />
          <button onClick={addFriend}>Send Request</button>
        </div>
      </section>

      {/* Snackbar */}
      {snackbar.message && <div className={`snackbar show ${snackbar.type}`}>{snackbar.message}</div>}

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>
          Pending
        </button>
        <button className={activeTab === "accepted" ? "active" : ""} onClick={() => setActiveTab("accepted")}>
          Friends
        </button>
      </div>

      {/* Stats */}
      {activeTab === "accepted" && (
        <div className="friend-stats card">
          <span>Total Friends: {stats.total}</span>
          <span>Active Mood Streaks: {stats.streaks}</span>
        </div>
      )}

      {/* Pending Received */}
      {activeTab === "pending" && pendingReceived.length > 0 && (
        <section className="pending-section">
          <h2>Pending Requests</h2>
          <div className="batch-actions">
            <button onClick={() => batchAction("accept")}>Accept All</button>
            <button onClick={() => batchAction("reject")}>Reject All</button>
          </div>
          {pendingReceived.map((f) => (
            <div key={f.friendship_id} className="friend-card">
              <span className="friend-name">{f.username}</span>
              <div className="action-buttons">
                <button onClick={() => updateFriend("accept", f.friendship_id, f.friend_id)}>Accept</button>
                <button onClick={() => updateFriend("reject", f.friendship_id, f.friend_id)}>Reject</button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Pending Sent */}
      {activeTab === "pending" && pendingSent.length > 0 && (
        <section className="pending-section">
          <h2>Sent Requests</h2>
          {pendingSent.map((f) => (
            <div key={f.friendship_id} className="friend-card">
              <span className="friend-name">{f.username}</span>
              <span className="status-label">Pending...</span>
            </div>
          ))}
        </section>
      )}

      {/* Accepted Friends */}
      {activeTab === "accepted" && accepted.length > 0 && (
        <section className="accepted-section">
          {accepted.map((f) => (
            <div key={f.friendship_id} className="friend-card">
              <div className="friend-header">
                <span className="friend-name">{f.username}</span>
                <button onClick={() => updateFriend("remove", f.friendship_id, f.friend_id)}>Remove</button>
              </div>

              {/* Feed */}
              <div className="feed-section grid">
                {f.last_moods.map((m, idx) => (
                  <div key={idx} className="feed-item mood">
                    {m.mood} {m.notes && `(${new Date(m.notes).toLocaleDateString()})`}
                  </div>
                ))}
                {f.last_meals.map((m, idx) => (
                  <div key={idx} className="feed-item meal">
                    🍽 {m.meal_name}
                  </div>
                ))}
                {f.encouragements.map((enc, idx) => (
                  <div key={idx} className="feed-item encouragement-item">
                    💌 {enc.message} ({new Date(enc.created_at).toLocaleDateString()})
                  </div>
                ))}
              </div>

              {/* Encourage */}
              <div className="encourage-section">
                <input
                  placeholder="Send encouragement..."
                  value={encourageMsgs[f.friend_id] || ""}
                  onChange={(e) => setEncourageMsgs((prev) => ({ ...prev, [f.friend_id]: e.target.value }))}
                />
                <button onClick={() => sendEncouragement(f.friend_id)}>Send</button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Friends;
