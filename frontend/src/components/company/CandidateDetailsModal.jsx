import React from 'react';

const CandidateDetailsModal = ({ candidate, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Candidate Details</h3>
        {/* Add candidate information */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CandidateDetailsModal;
