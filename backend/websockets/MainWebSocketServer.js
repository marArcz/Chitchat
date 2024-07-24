import { WebSocketServer } from "ws"
import Message from "../models/Message";

export function MainWebSocketServer() {
    return {
        connectedUsersWs: [],
        channels: {},
        webSs: null,
        setupServer: function () {
            this.webSs = new WebSocketServer({ noServer: true })
            this.webSs.on('connection', (ws, req) => {

                // handle on message
                ws.on('message', async (msg) => {
                    const data = JSON.parse(msg);
                    switch (data.type) {
                        case 'connect':
                            // store user's connection
                            this.connectedUsersWs.push({
                                ws,
                                userId: data.userId
                            });
                            break;
                        case 'private_message':
                            this.handlePrivateMessage(ws, data);
                            break;
                    }
                })
            })
        },
        handlePrivateMessage: async function (ws, data) {
            const { conversationId, userId, message } = data;
            // find channel
            const channel = this.channels[conversationId];
            channel.foreach(client => {
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                    client.send(JSON.stringify({
                        type: 'private_message',
                        conversationId,
                        message
                    }))
                }
            })

            this.notify(ws, {
                action: data.type,
                
            })
        },
        notify: async function (ws, data) {

        }
    }
}