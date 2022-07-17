import WebSocket, { WebSocketServer } from 'ws';
import express, { Application, Request, Response } from 'express';

const app: Application = express();

const server = app.listen(5000, () => console.log("Server running"));

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
    console.log("A new client connected");
    ws.send("welcome!");

    ws.on("message", (message) => {
        console.log(`Received message: ${message}`)
        ws.send(`Received your message :)`)
    })
})

app.get('/', (req: Request, res: Response) => {
    res.send('Hello');
});


