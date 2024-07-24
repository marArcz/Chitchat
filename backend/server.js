import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import url from 'url';
import mongoose from 'mongoose';
import AuthRoute from './routes/AuthRoute.js'
import ConversationsRoutes from './routes/ConversationsRoute.js';
import ProfileRoute from './routes/ProfileRoute.js';
import Auth from './middlewares/Auth.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import User from './models/User.js';
import FriendRequestRoutes from './routes/FriendRequestsRoute.js'
import FriendsRoute from './routes/FriendsRoute.js'
import FriendRequest from './models/FriendRequest.js';
import MatchAndChatWebSocketServer from './websockets/ChatWebSocketServer.js';
// initialize env
dotenv.config();

const app = express();
const port = process.env.APP_PORT || 4000
const server = http.createServer(app)

// middlewares
app.use(cors({
    origin: [
        'http://localhost:5173'
    ],
    methods: ['POST', 'GET', 'DELETE', 'PATCH', 'PUT'],
    credentials: true
}))

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// routes
app.use('/api/auth', AuthRoute)
app.use('/api/conversations', Auth, ConversationsRoutes)
app.use('/api/profile', Auth, ProfileRoute)
app.use('/api/friend-requests', Auth, FriendRequestRoutes)
app.use('/api/friends', Auth, FriendsRoute)
// create websocket server
const notifyWss = new WebSocketServer({ noServer: true });
const channels = {};
const connectedUsers = {}; // users that are currently connected to web server

// web socket servers
const matchAndChatWss = new MatchAndChatWebSocketServer();

server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/match-and-chat') {
        matchAndChatWss.webSocket.handleUpgrade(request, socket, head, (ws) => {
            matchAndChatWss.webSocket.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});


// setup mongodb connection
mongoose.connect(process.env.MONGOOSE_CONNECTION);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

server.listen(port, () => console.log('Server is listening on port ', port));
