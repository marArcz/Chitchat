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
app.use('/api/profile',Auth, ProfileRoute)
// create websocket server
const chatWss = new WebSocketServer({ noServer: true });
const waitingUsers = []
const channels = {};

chatWss.on('connection', (ws, req) => {
    ws.on('message', async (msg) => {
        const data = JSON.parse(msg);

        if (data.type === 'match') {
            const user = await User.findById(data.userId);
            if (user) {
                // add user to queue
                waitingUsers.push({
                    ws,
                    data: user,
                    preferences: data.preferences
                });
                // match users
                matchUpUsers();
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'User not found' }));
            }
        } else if (data.type === 'private_message') {
            const { channelId, message, userId } = data;
            const channel = channels[channelId];

            if (channel) {
                let chatMessage = new Message({
                    conversationId: channelId,
                    sender: userId,
                    content: message
                })

                await chatMessage.save();
                chatMessage = await Message.findById(chatMessage._id).populate('sender')

                channel.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        if (chatMessage) {
                            client.send(JSON.stringify({
                                type: 'private_message',
                                channelId,
                                chat: chatMessage,
                            }));
                        } else {
                            client.send(JSON.stringify({
                                type: 'error',
                                channelId,
                                chat: chatMessage,
                            }));
                        }
                    }
                });
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Channel not found', channels }));
            }
        }
    })

    ws.on('close', (error) => {
        let channelId = findChannelIdByWs(ws);
        let channel = channels[channelId];
        console.log('closed user')
        removeUser(ws)
        if (channel) {
            console.log('closed user found channel')
            channel.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'disconnected',
                        channelId,
                    }));
                }
            });
        }
    });
})

const findChannelIdByWs = (ws) => {
    for (let channelId in channels) {
        console.log('looking at channel: ', channelId);
        let index = channels[channelId].findIndex(savedWs => savedWs === ws);

        if (index > -1) {
            return channelId;
        }
    }
    console.log('cant find channel id')
    return null;
}

// try to match up waiting users
const matchUpUsers = async () => {
    while (waitingUsers.length >= 2) {
        const user1 = waitingUsers.shift();
        // find a user to matchUp based on preferences
        const user2 = waitingUsers.find((user) => {
            if (user.preferences.pronoun === 'both') return true;
            return user.preferences.pronoun === user1.data.pronoun;
        });

        if (!user2) {
            return user1.ws.send(JSON.stringify({
                type: 'match',
                success: false
            }));
        }

        removeUser(user2.ws);
        // find conversation
        let conversation = await Conversation.findOne({ users: { $all: [user1.data._id, user2.data._id] } })
        // create conversation record 
        if (!conversation) {
            conversation = new Conversation({
                users: [user1.data._id, user2.data._id]
            })

            await conversation.save();
        }

        // user conversationId as channelId
        const channelId = conversation._id;
        // save channel
        channels[channelId] = [user1.ws, user2.ws];
        // console.log(`Current channels: ${Array.from(channels.keys()).map(key => key.toString())}`);

        const matchData = {
            type: 'match',
            success: true,
            channelId,
        }

        user1.ws.send(JSON.stringify({
            ...matchData,
            matchedUser: user2.data,
        }))

        user2.ws.send(JSON.stringify({
            ...matchData,
            matchedUser: user1.data,
        }))
    }
}

const removeUser = (ws) => {
    const index = waitingUsers.findIndex(user => user.ws === ws);
    if (index !== -1) {
        waitingUsers.splice(index, 1);
    }
}


server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/chat') {
        chatWss.handleUpgrade(request, socket, head, (ws) => {
            chatWss.emit('connection', ws, request);
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
