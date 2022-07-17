import WebSocket, { WebSocketServer } from 'ws';
import express, { Application, Request, Response } from 'express';

const app: Application = express();

const server = app.listen(5000, () => console.log("Server running"));

const wss = new WebSocket.Server({ server });

const broadcastMessage = (message: string) => {
    wss.clients.forEach((client) => {
        client.send(message);
    });
}

wss.on("connection", (ws: WebSocket) => {
    console.log("A new client connected");
    ws.send("welcome!");

    ws.on("message", (message) => {
        console.log(`Received message: ${message}`);
        broadcastMessage(`Received a message: ${message}`);
    });

    ws.on("close", () => {
        console.log("client disconnected")
    });
})

app.get('/', (req: Request, res: Response) => {
    res.send('Hello');
});


