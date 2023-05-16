import React from 'react';
import UserItem from './UserItem';

const UsersList = ({users}) => {
  if (users.length === 0) {
    return (
      <div>
        <h2>No Students</h2>
      </div>
    );
  }
  return (
    <div>
      {users.map((u) => (
        <UserItem key={u.id} user={u} />
      ))}
    </div>
  );
};

export default UsersList;
