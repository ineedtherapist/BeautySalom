import React from 'react';

function FormModal({ isOpen, handleClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={handleClose} className="close-button">
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default FormModal;