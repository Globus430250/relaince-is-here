import React, { useEffect, useState } from 'react';

export default function Account({ user }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/account/${user.id}`)
      .then(res => res.json())
      .then(setInfo);
  }, [user.id]);

  if (!info) return <div>Loading...</div>;

  return (
    <div>
      <h2>Account Info</h2>
      <p><b>Name:</b> {info.name}</p>
      <p><b>Username:</b> {info.username}</p>
      <p><b>User ID:</b> {info.id}</p>
    </div>
  );
}