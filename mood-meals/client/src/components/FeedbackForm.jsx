import React, { useState } from "react";
import axios from "axios";
import "../styles/FeedbackForm.css";

const FeedbackForm = ({ onSuccess }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      attachments.forEach((file) => formData.append("attachment", file));

      await axios.post("/api/feedback", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSubject("");
      setMessage("");
      setAttachments([]);
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
      <input type="file" multiple onChange={handleFileChange} />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
