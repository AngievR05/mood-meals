import React, { useState } from 'react';
import '../styles/MoodNoteModal.css';

const MoodNoteModal = ({ onSave }) => {
  const [note, setNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    onSave(note);
    setNote('');
    setIsOpen(false);
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
        + Add Mood Note
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content mood-note-modal">
            <h3>Why do you feel this way?</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type your thoughts..."
              className="form-input"
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoodNoteModal;
