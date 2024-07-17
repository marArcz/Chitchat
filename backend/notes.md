# Setting up web socket server 
### With Channels
```js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store channels with user connections
const channels = {};

wss.on('connection', (ws, req) => {
  const parameters = url.parse(req.url, true);
  const channelId = parameters.query.channel;
  const userId = parameters.query.userId;

  if (!channelId || !userId) {
    ws.close();
    return;
  }

  // Add the user to the specified channel
  if (!channels[channelId]) {
    channels[channelId] = [];
  }
  channels[channelId].push({ userId, ws });

  ws.on('message', (message) => {
    console.log(`Received message: ${message} from user: ${userId} in channel: ${channelId}`);

    // Broadcast the message to all users in the channel
    channels[channelId].forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(`${userId}: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log(`User ${userId} disconnected from channel: ${channelId}`);
    channels[channelId] = channels[channelId].filter(client => client.ws !== ws);
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
```