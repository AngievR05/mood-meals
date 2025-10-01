import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Friends.css";

const Friends = () => {
  const [friends, setFriends] = useState({
    pendingReceived: [],
    pendingSent: [],
    accepted: []
  });
  const [newFriend, setNewFriend] = useState("");
  const [encourageMsgs, setEncourageMsgs] = useState({});
  const [snackbar, setSnackbar] = useState({ message: "", type: "" });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const userId = parseInt(localStorage.getItem("userId"));

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar({ message: "", type: "" }), 3000);
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/friends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Enhance lists with last moods / last meals
      const enhance = list => list.map(f => ({
        ...f,
        last_moods: f.latest_mood ? [{ mood: f.latest_mood, notes: f.mood_time }] : [],
        last_meals: f.last_meal ? [{ meal_name: f.last_meal }] : []
      }));

      setFriends({
        pendingReceived: enhance(res.data.pendingReceived),
        pendingSent: enhance(res.data.pendingSent),
        accepted: enhance(res.data.accepted)
      });
    } catch (err) {
      console.error(err);
      showSnackbar("Error fetching friends", "error");
    }
  };

  const addFriend = async () => {
    if (!newFriend.trim()) return showSnackbar("Please enter a username or email", "error");
    try {
      const res = await axios.post(
        `${backendUrl}/api/friends/add`,
        { friendIdentifier: newFriend },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      showSnackbar(res.data.message || "Friend request sent");
      setNewFriend("");
      fetchFriends();
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.error || "Error sending friend request", "error");
    }
  };

  const updateFriend = async (action, friendshipId, friendId) => {
    try {
      let res;
      if (action === "accept") {
        res = await axios.post(`${backendUrl}/api/friends/accept`, { friendshipId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else if (action === "reject") {
        res = await axios.post(`${backendUrl}/api/friends/reject`, { friendshipId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      } else if (action === "remove") {
        res = await axios.delete(`${backendUrl}/api/friends/${friendId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
      }
      showSnackbar(res.data.message);
      fetchFriends();
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.error || `Error ${action} friend`, "error");
    }
  };

  const sendEncouragement = async (friendId) => {
    const message = encourageMsgs[friendId];
    if (!message.trim()) return showSnackbar("Enter a message first", "error");
    try {
      const res = await axios.post(
        `${backendUrl}/api/friends/encourage`,
        { receiverId: friendId, message },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      showSnackbar(res.data.message);
      setEncourageMsgs(prev => ({ ...prev, [friendId]: "" }));
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.error || "Error sending encouragement", "error");
    }
  };

  useEffect(() => { fetchFriends(); }, []);

  const { pendingReceived, pendingSent, accepted } = friends;

  return (
    <div className="friends-page">

      {snackbar.message && (
        <div className={`snackbar show ${snackbar.type}`}>{snackbar.message}</div>
      )}

      {/* Add Friend Section */}
      <section className="connect-section card">
        <h2>Connect with Friends</h2>
        <input
          type="text"
          placeholder="Add by username or email"
          value={newFriend}
          onChange={e => setNewFriend(e.target.value)}
        />
        <button onClick={addFriend}>Send Request</button>
      </section>

      {/* Pending Requests Received */}
      {pendingReceived.length > 0 && (
        <section className="pending-section">
          <h2>Pending Requests</h2>
          {pendingReceived.map(f => (
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

      {/* Pending Requests Sent */}
      {pendingSent.length > 0 && (
        <section className="pending-section">
          <h2>Sent Requests</h2>
          {pendingSent.map(f => (
            <div key={f.friendship_id} className="friend-card">
              <span className="friend-name">{f.username}</span>
              <span className="status-label">Pending...</span>
            </div>
          ))}
        </section>
      )}

      {/* Accepted Friends */}
      {accepted.length > 0 && (
        <section className="accepted-section">
          <h2>Your Friends</h2>
          {accepted.map(f => (
            <div key={f.friendship_id} className="friend-card">
              <div className="friend-header">
                <span className="friend-name">{f.username}</span>
                <button onClick={() => updateFriend("remove", f.friendship_id, f.friend_id)}>Remove</button>
              </div>

              <div className="feed-section">
                {f.last_moods.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="feed-item mood">
                    {m.mood} {m.notes ? `(${new Date(m.notes).toLocaleDateString()})` : ''}
                  </div>
                ))}
                {f.last_meals.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="feed-item meal">🍽 {m.meal_name}</div>
                ))}
              </div>

              <div className="encourage-section">
                <input
                  type="text"
                  value={encourageMsgs[f.friend_id] || ""}
                  onChange={e => setEncourageMsgs(prev => ({ ...prev, [f.friend_id]: e.target.value }))}
                  placeholder="Send encouragement..."
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
