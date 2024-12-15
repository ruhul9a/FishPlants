const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // JWT for token generation

const app = express();
const port = 3000;

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',  
  user: 'root',       
  password: '',       
  database: 'fish_plant_db' 
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route for user registration (Create)
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
  db.query(query, [username, email, password], (err, result) => {
    if (err) {
      res.status(500).send('Error registering user');
      return;
    }
    res.status(200).send('User registered successfully');
  });
});

// Route for user login (Authentication)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).send('Error during login');
    }
    if (result.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    // Direct password comparison (no hashing)
    if (result[0].password !== password) {
      return res.status(401).send('Invalid email or password');
    }

    // If login is successful, generate a JWT token
    const token = jwt.sign({ id: result[0].id, username: result[0].username }, 'secretKey', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token: token });
  });
});

// Route to get all users (Read)
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching users');
      return;
    }
    res.status(200).json(result);
  });
});

// Route to get a single user by ID (Read)
app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching user data');
    }
    if (result.length === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(result[0]);
  });
});


// Route to update user by ID (Update)
app.put('/update-user/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const query = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
  db.query(query, [username, email, password, id], (err, result) => {
    if (err) {
      res.status(500).send('Error updating user');
      return;
    }
    res.status(200).send('User updated successfully');
  });
});

// Route to delete user by ID (Delete)
app.delete('/delete-user/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send('Error deleting user');
      return;
    }
    res.status(200).send('User deleted successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
