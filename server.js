const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Serve static files like HTML, CSS, JS from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for demonstration (use a database in production)
const games = {};

// Endpoint to create a new game
app.post("/create-game", (req, res) => {
    const gamePin = Math.floor(100000 + Math.random() * 900000).toString();
    games[gamePin] = { creator: req.body.name, players: [req.body.name] };
    res.json({ gamePin, players: games[gamePin].players });
});

// Endpoint to join an existing game
app.post("/join-game", (req, res) => {
    const { gamePin, name } = req.body;
    if (!games[gamePin]) return res.status(404).json({ message: "Game not found" });
    games[gamePin].players.push(name);
    io.to(gamePin).emit("player-joined", { name });
    res.json({ players: games[gamePin].players });
});

// Set up socket connections for real-time events
io.on("connection", (socket) => {
    // Join a specific game room
    socket.on("join-room", (gamePin) => {
        socket.join(gamePin);
    });

    // Kick a player
    socket.on("kick-player", ({ gamePin, name }) => {
        games[gamePin].players = games[gamePin].players.filter((player) => player !== name);
        io.to(gamePin).emit("player-kicked", { name });
    });

    // Start the game
    socket.on("start-game", (gamePin) => {
        io.to(gamePin).emit("game-started");
    });
});

// Route to serve the homepage when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HomePage.html'));
});

// Start the server on port 3000
server.listen(3000, () => console.log("Server running on http://localhost:3000"));
