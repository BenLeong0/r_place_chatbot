import WebSocket from 'ws';
import express, { Application, Request, Response } from 'express';

const app: Application = express();

const server = app.listen(5000, () => console.log("Server running"));

const wss = new WebSocket.Server({ server });

const broadcastMessage = (message: string) => {
    wss.clients.forEach((client) => {
        client.send(message);
    });
}

wss.on("connection", (ws: WebSocket, req: Request) => {
    console.log("A new client connected");
    ws.send("welcome!");

    ws.on("message", (message) => {
        console.log(`Received message: ${message}`);
        console.log(ws.listeners('connection').toString());
        broadcastMessage(JSON.stringify(req));
    });

    ws.on("close", () => {
        console.log("client disconnected");
    });
})

app.get('/:userId', (req: Request, res: Response) => {
    const userId = req.params.userId;
    res.sendFile(`/assets/${userId}.png`, { root: "." });
});


