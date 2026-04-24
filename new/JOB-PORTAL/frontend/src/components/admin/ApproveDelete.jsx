import React from 'react';

const ApproveDelete = ({ onApprove, onDelete }) => {
  return (
    <div className="approve-delete">
      <button onClick={onApprove} className="btn-approve">
        Approve
      </button>
      <button onClick={onDelete} className="btn-delete">
        Delete
      </button>
    </div>
  );
};

export default ApproveDelete;
