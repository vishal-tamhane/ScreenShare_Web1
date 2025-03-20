import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const rooms = new Map(); // Store active rooms

// Middleware & view config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/generate', (req, res) => {
  res.render('CreateIdSender');
});

app.get('/join', (req, res) => {
  res.render('join');
});

// Room Route for both sender and receiver
app.get('/room/:roomID', (req, res) => {
  const { roomID } = req.params;
  if (!rooms.has(roomID)) {
    return res.render('error', { message: "Room not found or expired." });
  }
  res.render('room', { roomID });
});

// Generate Unique ID
app.post('/generate-id', (req, res) => {
  const { userName } = req.body;
  if (!userName) return res.status(400).json({ error: 'Name is required' });

  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const cleanName = userName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4);
  const roomId = `${cleanName}${randomDigits}`;

  rooms.set(roomId, {
    userName: cleanName,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000
  });

  res.json({ roomId });
});

// Socket.io signaling for multi-receiver support
io.on('connection', (socket) => {
  console.log("A user connected:", socket.id);

  socket.on('join-room', (roomID) => {
    socket.join(roomID);
    console.log(`Socket ${socket.id} joined room: ${roomID}`);
    // Notify the sender (all others in the room) that a new receiver has connected.
    socket.to(roomID).emit('user-connected', socket.id);
  });

  socket.on('offer', ({ roomID, offer, receiverId }) => {
    // Forward the offer to the specific receiver
    io.to(receiverId).emit('offer', { offer, receiverId });
  });

  socket.on('answer', ({ roomID, answer, receiverId }) => {
    // Forward the answer to the sender (the one who created the offer)
    // We assume that the sender is in the same room and will receive answers.
    socket.to(roomID).emit('answer', { answer, receiverId });
  });

  socket.on('ice-candidate', (data) => {
    // data may include: { roomID, candidate, receiverId } or without receiverId (for receiver side)
    // Forward ICE candidates to the appropriate peer.
    if (data.receiverId) {
      io.to(data.receiverId).emit('ice-candidate', { candidate: data.candidate, receiverId: data.receiverId });
    } else {
      socket.to(data.roomID).emit('ice-candidate', { candidate: data.candidate });
    }
  });

  socket.on('disconnect', () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Cleanup expired rooms every minute
setInterval(() => {
  const now = Date.now();
  rooms.forEach((room, roomId) => {
    if (now > room.expiresAt) rooms.delete(roomId);
  });
}, 60 * 1000);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
