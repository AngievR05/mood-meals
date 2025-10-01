import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Friends.css";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [newFriendId, setNewFriendId] = useState("");
  const [search, setSearch] = useState("");
  const [encourageMsg, setEncourageMsg] = useState("");

  // Fetch friends and pending requests
  const fetchFriends = async () => {
    try {
      const res = await axios.get("/api/friends", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFriends(res.data);
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  // Send friend request
  const addFriend = async () => {
    if (!newFriendId) return;
    try {
      await axios.post(
        "/api/friends/add",
        { friendId: newFriendId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewFriendId("");
      fetchFriends();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding friend");
    }
  };

  // Remove friend
  const removeFriend = async (friendId) => {
    try {
      await axios.delete(`/api/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchFriends();
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  // Accept a pending request
  const acceptFriend = async (friendshipId) => {
    try {
      await axios.post(
        "/api/friends/accept",
        { friendshipId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchFriends();
    } catch (err) {
      console.error("Error accepting friend:", err);
    }
  };

  // Reject a pending request
  const rejectFriend = async (friendshipId) => {
    try {
      await axios.post(
        "/api/friends/reject",
        { friendshipId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchFriends();
    } catch (err) {
      console.error("Error rejecting friend:", err);
    }
  };

  // Send encouragement
  const sendEncouragement = async (receiverId) => {
    if (!encourageMsg) return;
    try {
      await axios.post(
        "/api/friends/encourage",
        { receiverId, message: encourageMsg },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEncourageMsg("");
      alert("Encouragement sent!");
    } catch (err) {
      console.error("Error sending encouragement:", err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Filter friends list
  const filteredFriends = friends.filter((f) =>
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="friends-page">
      <section className="connect-section card">
        <h2>Connect with Friends</h2>
        <div className="friend-input">
          <input
            type="text"
            placeholder="Add Friend by User ID..."
            value={newFriendId}
            onChange={(e) => setNewFriendId(e.target.value)}
          />
          <button onClick={addFriend}>Send Request</button>
        </div>
      </section>

      <section className="friends-section">
        <h2>Your Friends</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="friends-list">
          {filteredFriends.length === 0 ? (
            <p>No friends yet. Add someone!</p>
          ) : (
            filteredFriends.map((friend) => (
              <div key={friend.friendship_id} className="friend-card">
                <img
                  src={friend.profile_picture || "/default-avatar.png"}
                  alt={friend.username}
                  className="friend-avatar"
                />
                <h3>{friend.username}</h3>
                <p>
                  Mood:{" "}
                  {friend.latest_mood
                    ? `${friend.latest_mood} (${friend.mood_time})`
                    : "No recent mood"}
                </p>
                <p>Last Meal: {friend.last_meal || "No meal logged"}</p>
                {friend.status === "pending" ? (
                  <div className="pending-actions">
                    <button onClick={() => acceptFriend(friend.friendship_id)}>
                      Accept
                    </button>
                    <button onClick={() => rejectFriend(friend.friendship_id)}>
                      Reject
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="remove-btn"
                      onClick={() => removeFriend(friend.friend_id)}
                    >
                      Remove
                    </button>
                    <div className="encourage-section">
                      <input
                        type="text"
                        placeholder="Send encouragement..."
                        value={encourageMsg}
                        onChange={(e) => setEncourageMsg(e.target.value)}
                      />
                      <button
                        onClick={() => sendEncouragement(friend.friend_id)}
                      >
                        Send
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

// Optional: Map moods to emojis
const moodToEmoji = (mood) => {
  const map = {
    Happy: "😊",
    Sad: "😢",
    Angry: "😡",
    Stressed: "😰",
    Bored: "🥱",
    Energised: "⚡",
    Confused: "😕",
    Grateful: "🙏",
  };
  return map[mood] || "🙂";
};

export default Friends;
