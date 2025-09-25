import React, { useState } from "react";
import axios from "axios";
import "../styles/FeedbackForm.css";

const API_URL = "http://localhost:5000/api/feedback";

const FeedbackForm = ({ onSuccess }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        API_URL,
        {
          subject,
          message,
          attachments: [], // no uploads for now
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSubject("");
      setMessage("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2>Send Feedback</h2>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <textarea
        placeholder="Your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
