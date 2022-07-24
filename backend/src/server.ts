import express, { Application, Request, Response } from 'express';
import WebSocket from 'ws';

import { Canvas, loadImage } from 'canvas';
import * as fs from 'fs';

import { isAlphanumeric, getImagePath } from './utils';

import { UpdateRequestBody } from './types/UpdateRequest';
import { updateImage } from './image_utils';


const app: Application = express();
app.use(express.json());

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

app.get('/:imageId', (req: Request, res: Response) => {
    const imageId = req.params.imageId;
    const imagePath = getImagePath(imageId);

    if (!fs.existsSync(imagePath)) {
        // TODO: Implement createImage
        console.log("Image doesn't exist yet.");
        res.end();
        return;
    }

    res.sendFile(imagePath, { root: "." });
});


app.post('/update', (req: Request, res: Response) => {
    const updateRequestBody: UpdateRequestBody = req.body;
    const { imageId, x, y, colour } = updateRequestBody;

    if (!isAlphanumeric(imageId)) {
        console.log(`Invalid image id: ${imageId}`);
        res.end();
        return;
    }

    const imagePath = getImagePath(imageId);
    if (!fs.existsSync(imagePath)) {
        // TODO: Implement createImage
        console.log(`Image "${imageId}" doesn't exist (yet)`);
        res.end();
        return;
    }

    console.log(`Updating "${imageId}": setting (${x}, ${y}) to ${colour}`);
    updateImage(imagePath, colour, x, y);

    broadcastMessage(JSON.stringify({
        "event": "imageUpdate",
        "imageId": imageId
    }));

    res.json(req.body);

});
