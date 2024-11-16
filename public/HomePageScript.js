// Import required modules
const express = require('express');
const path = require('path');

// Initialize the express app
const app = express();

// Middleware to parse JSON (for POST requests)
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the homepage (HomePage.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'HomePage.html'));
});

// Route to serve CreatePage.html for creating a party
app.get('/CreatePage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'CreatePage.html'));
});

// Route to serve GamePage.html where players can play
app.get('/GamePage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'GamePage.html'));
});

// Handle POST request for creating a game
let gameData = {};  // This will store game data temporarily

app.post('/create-game', (req, res) => {
  const { name } = req.body;

  // Check if the name is provided
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  // Generate a random game PIN
  const gamePin = Math.floor(100000 + Math.random() * 900000).toString();
  gameData[gamePin] = {
    creator: name,
    players: [name],  // The creator is the first player
  };

  // Send the generated PIN and player list back to the client
  res.status(200).json({ gamePin, players: gameData[gamePin].players });
});

// Handle POST request for joining a game
app.post('/join-game', (req, res) => {
  const { gamePin, name } = req.body;

  // Check if the game PIN and name are provided
  if (!gamePin || !name) {
    return res.status(400).json({ error: 'Game PIN and name are required' });
  }

  // Check if the game exists
  if (!gameData[gamePin]) {
    return res.status(404).json({ error: 'Game not found' });
  }

  // Add the player to the game
  gameData[gamePin].players.push(name);
  res.status(200).json({ players: gameData[gamePin].players });
});

// Start the server on port 3000 or the port specified in environment variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
