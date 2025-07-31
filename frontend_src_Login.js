import React, { useState } from 'react';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setUser(data.user))
      .catch(() => setError('Invalid login'));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
