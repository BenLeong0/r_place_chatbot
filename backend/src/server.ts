import express, { Application, Request, Response } from 'express';
import WebSocket from 'ws';

import { uploadImage } from './aws';
import { downloadImageIfFileNonExistent, generateNewImage, generateNewImageIfFileNonExistent, updateImage } from './image_utils';
import { isAlphanumeric, getImagePath, fileExists } from './utils';

import { CreateRequestBody, UpdateRequestBody } from './types/UpdateRequest';


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

    if (!isAlphanumeric(imageId)) {
        console.log(`Invalid image id: ${imageId}`);
        res.end();
        return;
    }

    downloadImageIfFileNonExistent(imageId);
    generateNewImageIfFileNonExistent(imageId);

    const imagePath = getImagePath(imageId);
    res.sendFile(imagePath, { root: "." });
});


app.post('/update', async (req: Request, res: Response) => {
    const updateRequestBody: UpdateRequestBody = req.body;
    const { imageId, x, y, colour } = updateRequestBody;

    if (!isAlphanumeric(imageId)) {
        console.log(`Invalid image id: ${imageId}`);
        res.end();
        return;
    }

    downloadImageIfFileNonExistent(imageId);
    generateNewImageIfFileNonExistent(imageId);

    console.log(`Updating "${imageId}": setting (${x}, ${y}) to ${colour}`);
    const imagePath = getImagePath(imageId);
    updateImage(imagePath, colour, x, y);

    uploadImage(imageId);

    broadcastMessage(JSON.stringify({
        event: "imageUpdate",
        imageId: imageId,
    }));

    res.json({ success: true });

});


app.post('/create', (req: Request, res: Response) => {
    const updateRequestBody: CreateRequestBody = req.body;
    const { imageId, width = 20, height = 20, colour = undefined } = updateRequestBody;

    if (!isAlphanumeric(imageId)) {
        console.log(`Invalid image id: ${imageId}`);
        res.end();
        return;
    }

    const imagePath = getImagePath(imageId);
    if (fileExists(imagePath)) {
        console.log(`Image ${imageId} already exists`);
        res.end();
        return;
    }

    generateNewImage(imagePath, width, height, colour);

    broadcastMessage(JSON.stringify({
        "event": "imageCreate",
        "imageId": imageId
    }));

    res.json({ success: true });

});
