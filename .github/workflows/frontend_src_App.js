import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Account from './Account';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  if (!user) return <Login setUser={setUser} />;

  return (
    <div>
      <nav>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('account')}>Account</button>
        <button onClick={() => setUser(null)}>Logout</button>
      </nav>
      {page === 'dashboard' && <Dashboard user={user} />}
      {page === 'account' && <Account user={user} />}
    </div>
  );
}

export default App;