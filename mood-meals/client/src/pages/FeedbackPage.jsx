import React, { useState, useEffect } from "react"; 
import FeedbackForm from "../components/FeedbackForm";
import axios from "axios";
import "../styles/FeedbackForm.css";

const API_URL = "http://localhost:5000/api/feedback";

const FeedbackPage = () => {
  const [pastFeedback, setPastFeedback] = useState([]);

  const fetchPastFeedback = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPastFeedback(res.data);
    } catch (err) {
      console.error("Failed to fetch past feedback:", err);
    }
  };

  useEffect(() => {
    fetchPastFeedback();
  }, []);

  const handleSuccess = () => {
    alert("Thanks for your feedback!");
    fetchPastFeedback(); // refresh past feedback
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <FeedbackForm onSuccess={handleSuccess} />

      {pastFeedback.length > 0 && (
        <div className="past-feedback-list" style={{ marginTop: "30px" }}>
          <h3>Your Past Feedback</h3>
          {pastFeedback.map((f) => (
            <div
              key={f.id}
              className="feedback-item"
              style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}
            >
              <strong>{f.subject}</strong> — <em>{f.status}</em>
              <p>{f.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
