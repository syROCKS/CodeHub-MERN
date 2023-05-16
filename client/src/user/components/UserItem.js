import React from 'react';
import './UserItem.css'

const UserItem = ({ user }) => {
  return (
    <div className="userItem">
      <h3>{user.name}</h3>
    </div>
  );
};

export default UserItem;
