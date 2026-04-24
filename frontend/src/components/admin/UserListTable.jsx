import React from 'react';

const UserListTable = ({ users, onApprove, onDelete }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    <div className="avatar-circle">{user.firstName?.charAt(0)}</div>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      {user.companyName && <div className="text-xs text-gray">{user.companyName}</div>}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge role-${user.role}`}>{user.role}</span>
                </td>
                <td>
                  {user.isApproved ? (
                    <span className="badge status-active">Active</span>
                  ) : (
                    <span className="badge status-pending">Pending</span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {!user.isApproved && (
                      <button 
                        className="btn-icon btn-approve" 
                        onClick={() => onApprove(user._id)}
                        title="Approve User"
                      >
                        ✓
                      </button>
                    )}
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => onDelete(user._id)}
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserListTable;