const express = require('express');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3').verbose();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./billing.db');

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    due_date TEXT,
    status TEXT,
    details TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Mock login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (row) {
        res.json({ success: true, user: { id: row.id, name: row.name } });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

// Get user bills
app.get('/api/bills/:userId', (req, res) => {
  db.all(
    'SELECT * FROM bills WHERE user_id = ?',
    [req.params.userId],
    (err, rows) => {
      res.json(rows);
    }
  );
});

// Get bill details
app.get('/api/bill/:billId', (req, res) => {
  db.get(
    'SELECT * FROM bills WHERE id = ?',
    [req.params.billId],
    (err, row) => {
      res.json(row);
    }
  );
});

// Mock pay bill
app.post('/api/pay/:billId', (req, res) => {
  db.run(
    'UPDATE bills SET status = "Paid" WHERE id = ?',
    [req.params.billId],
    function (err) {
      if (!err) res.json({ success: true });
      else res.status(500).json({ success: false });
    }
  );
});

// Get account info
app.get('/api/account/:userId', (req, res) => {
  db.get(
    'SELECT id, username, name FROM users WHERE id = ?',
    [req.params.userId],
    (err, row) => {
      res.json(row);
    }
  );
});

// Seed a user and some bills if not exists
db.get('SELECT * FROM users WHERE username = "demo"', (err, row) => {
  if (!row) {
    db.run(
      'INSERT INTO users (username, password, name) VALUES (?, ?, ?)',
      ['demo', 'demo', 'Demo User'],
      function () {
        db.run(
          'INSERT INTO bills (user_id, amount, due_date, status, details) VALUES (?, ?, ?, ?, ?)',
          [1, 1200, '2025-08-10', 'Unpaid', 'Electricity Bill July 2025']
        );
        db.run(
          'INSERT INTO bills (user_id, amount, due_date, status, details) VALUES (?, ?, ?, ?, ?)',
          [1, 900, '2025-07-10', 'Paid', 'Electricity Bill June 2025']
        );
      }
    );
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));