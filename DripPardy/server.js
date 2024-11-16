const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const games = {};

// Create a game
app.post("/create-game", (req, res) => {
  const gamePin = Math.floor(100000 + Math.random() * 900000).toString();
  games[gamePin] = { creator: req.body.name, players: [req.body.name] };
  res.json({ gamePin, players: games[gamePin].players });
});

// Join a game
app.post("/join-game", (req, res) => {
  const { gamePin, name } = req.body;
  if (!games[gamePin]) return res.status(404).json({ message: "Game not found" });
  games[gamePin].players.push(name);
  io.to(gamePin).emit("player-joined", { name });
  res.json({ players: games[gamePin].players });
});

// Real-time socket events
io.on("connection", (socket) => {
  socket.on("join-room", (gamePin) => {
    socket.join(gamePin);
  });

  socket.on("start-game", (gamePin) => {
    io.to(gamePin).emit("game-started");
  });

  socket.on("kick-player", ({ gamePin, name }) => {
    if (games[gamePin]) {
      games[gamePin].players = games[gamePin].players.filter((player) => player !== name);
      io.to(gamePin).emit("player-kicked", { name });
    }
  });
});

// Start the server
server.listen(3000, () => console.log("Server running on http://localhost:3000"));
