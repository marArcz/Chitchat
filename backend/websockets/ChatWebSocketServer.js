import { WebSocket, WebSocketServer } from "ws";
import User from "../models/User.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import FriendRequest from "../models/FriendRequest.js";


class MatchAndChatWebSocketServer {
    constructor() {
        this.waitingUsers = [];
        this.channels = [];
        this.webSocket = new WebSocketServer({ noServer: true });
        this.setUpServer();
    }
    setUpServer() {
        this.webSocket.on('connection', (ws, req) => {
            ws.on('message', async (msg) => {
                const data = JSON.parse(msg);

                if (data.type === 'match') {
                    const user = await User.findById(data.userId);
                    if (user) {
                        // add user to queue
                        this.waitingUsers.push({
                            ws,
                            data: user,
                            preferences: data.preferences
                        });
                        // match users
                        this.matchUpUsers();
                    } else {
                        ws.send(JSON.stringify({ type: 'error', message: 'User not found' }));
                    }
                } else if (data.type === 'private_message') {
                    const { channelId, message, userId } = data;
                    const channel = this.channels[channelId];

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
                    }
                    else {
                        ws.send(JSON.stringify({ type: 'error', message: 'Channel not found', channels }));
                    }
                }
                else if (data.type === 'friendRequest') {
                    const { channelId, userId, friendRequestId } = data;
                    const channel = this.channels[channelId];

                    if (channel) {
                        const friendRequest = await FriendRequest.findById(friendRequestId).populate(['recipient','requester']);
                        channel.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({
                                    type: 'friendRequest',
                                    friendRequest
                                }));
                            }

                        });
                    }
                    else {
                        ws.send(JSON.stringify({ type: 'error', message: 'Channel not found', channels }));
                    }
                }
            })

            ws.on('close', (error) => {
                let channelId = this.findChannelIdByWs(ws);
                let channel = this.channels[channelId];
                this.removeUser(ws)
                if (channel) {
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
    }

    findChannelIdByWs = (ws) => {
        for (let channelId in this.channels) {
            console.log('looking at channel: ', channelId);
            let index = this.channels[channelId].findIndex(savedWs => savedWs === ws);

            if (index > -1) {
                return channelId;
            }
        }
        console.log('cant find channel id')
        return null;
    }
    // try to match up waiting users
    matchUpUsers = async () => {
        while (this.waitingUsers.length >= 2) {
            const user1 = this.waitingUsers.shift();
            // find a user to matchUp based on preferences
            const user2 = this.waitingUsers.find((user) => {
                if (user.preferences.pronoun === 'both') return true;
                return user.preferences.pronoun === user1.data.pronoun;
            });

            if (!user2) {
                return user1.ws.send(JSON.stringify({
                    type: 'match',
                    success: false
                }));
            }

            this.removeUser(user2.ws);
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
            this.channels[channelId] = [user1.ws, user2.ws];
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

    removeUser = (ws) => {
        const index = this.waitingUsers.findIndex(user => user.ws === ws);
        if (index !== -1) {
            this.waitingUsers.splice(index, 1);
        }
    }

}

export default MatchAndChatWebSocketServer;