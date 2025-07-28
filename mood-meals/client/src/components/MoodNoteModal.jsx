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
      <button className="open-modal-btn" onClick={() => setIsOpen(true)}>
        + Add Mood Note
      </button>

      {isOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Why do you feel this way?</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type your thoughts..."
            />
            <div className="modal-actions">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button onClick={handleSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoodNoteModal;
