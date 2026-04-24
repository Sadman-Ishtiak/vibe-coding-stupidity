import React from 'react';

const UserListTable = () => {
  return (
    <div className="user-list-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Add user rows */}
        </tbody>
      </table>
    </div>
  );
};

export default UserListTable;
