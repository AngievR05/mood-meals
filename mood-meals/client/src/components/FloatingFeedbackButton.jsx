import React, { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import "../styles/FloatingFeedbackButton.css";

const FloatingFeedbackButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="floating-feedback-modal">
          <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
          <FeedbackForm onSuccess={() => { alert("Thanks for your feedback!"); setOpen(false); }} />
        </div>
      )}

      <button className="floating-feedback-btn" onClick={() => setOpen(true)}>
        Feedback
      </button>
    </>
  );
};

export default FloatingFeedbackButton;
