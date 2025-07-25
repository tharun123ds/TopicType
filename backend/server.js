const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const app = require('./app');
const initSocket = require('./socket/index'); // ensure proper path

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || '*', // secure CORS for production
        methods: ['GET', 'POST']
    }
});

// Initialize multiplayer socket logic
initSocket(io);

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
