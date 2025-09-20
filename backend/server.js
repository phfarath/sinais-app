const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Mini-Backend is running!');
});

// Dummy login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for user: ${username}`);
  if (username === 'admin' && password === 'password') {
    res.status(200).json({ token: 'fake-jwt-token' });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Dummy profile endpoint
app.get('/api/user/profile', (req, res) => {
  // In a real app, you'd check for a valid token here
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    res.status(200).json({ user: 'admin', email: 'admin@sinais-app.com' });
  } else {
    res.status(403).send('Forbidden');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
