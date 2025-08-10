import React from "react";
import "../styles/Friends.css";

const Friends = () => {
  return (
    <div className="friends-page">
      {/* Connect with Friends */}
      <section className="connect-section">
        <h2>Connect with Friends</h2>
        <p>Track your moods and meals together.</p>
        <div className="friend-input">
          <input type="text" placeholder="Add a Friend..." />
          <button>Add Friend</button>
        </div>
      </section>

      {/* Friends' Meal Logs */}
      <section className="meal-logs-section">
        <h2>Your Friends' Meal Logs</h2>
        <div className="meal-logs-grid">
          {[
            {
              name: "John Doe",
              status: "Feeling great after that salad!",
              meal: "Green Salad",
              tag: "Healthy Meal",
              time: "2 hrs ago",
            },
            {
              name: "Jane Smith",
              status: "That soup really helped.",
              meal: "Chicken Soup",
              tag: "Comfort Food",
              time: "3 hrs ago",
            },
            {
              name: "Chris Lee",
              status: "A bit tired today, but surviving!",
              meal: "Sushi",
              tag: "Special Occasion",
              time: "4 hrs ago",
            },
            {
              name: "Alice Wong",
              status: "Not my best mood, but trying to eat well.",
              meal: "Quinoa Bowl",
              tag: "Healthy Meal",
              time: "5 hrs ago",
            },
          ].map((log, index) => (
            <div key={index} className="meal-log-card">
              <div className="avatar-placeholder" />
              <div className="meal-log-info">
                <h3>{log.name}</h3>
                <p>{log.status}</p>
                <p className="meal-tag">
                  Last meal logged: <strong>{log.meal}</strong>
                </p>
                <div className="log-meta">
                  <span className="tag">{log.tag}</span>
                  <span className="time">Posted {log.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Friends */}
      <section className="friends-section">
        <h2>Your Friends</h2>
        <div className="friends-list">
          {[
            { name: "John Doe", mood: "Feeling Happy!", meal: "Spaghetti" },
            { name: "Jane Smith", mood: "Feeling Relaxed!", meal: "Salad" },
            { name: "Sam Green", mood: "Feeling Content!", meal: "Chicken Stir Fry" },
          ].map((friend, index) => (
            <div key={index} className="friend-card">
              <div className="emoji-placeholder">😊</div>
              <h3>{friend.name}</h3>
              <p>{friend.mood}</p>
              <p>Last meal shared: <strong>{friend.meal}</strong></p>
            </div>
          ))}
        </div>
      </section>

      {/* Friend's Mood Log */}
      <section className="mood-log-section">
        <div className="mood-log-card">
          <div className="mood-avatar" />
          <div className="mood-log-info">
            <h4>Friend's Mood Log</h4>
            <p>Recent updates from your friends.</p>
          </div>
          <div className="mood-log-buttons">
            <button>View Log</button>
            <button className="secondary">Support this Friend</button>
          </div>
        </div>
      </section>

      {/* Send Encouragement */}
      <section className="encouragement-section">
        <h2>Send Encouragement</h2>
        <textarea placeholder="Write a supportive message..." />
        <button>Send</button>
      </section>

      {/* Recent Posts by Friends */}
      <section className="recent-posts-section">
        <h2>Recent Posts by Friends</h2>
        <div className="posts-grid">
          {[
            {
              user: "Jane Smith",
              text: "Just enjoyed a fresh salad!",
              tags: ["Healthy", "Salad"],
            },
            {
              user: "John Doe",
              text: "Great evening with friends!",
              tags: ["Fun", "Dinner"],
            },
          ].map((post, index) => (
            <div key={index} className="post-card">
              <div className="post-image-placeholder" />
              <div className="post-info">
                <p>{post.text}</p>
                <div className="post-tags">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
                <span className="post-user">{post.user}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Friends;
