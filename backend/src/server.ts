import express, { Application, Request, Response } from 'express';
import * as fs from 'fs';
import WebSocket from 'ws';

import { Canvas, loadImage } from 'canvas';

import { UpdateRequestBody } from './types/UpdateRequest';


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

    console.log(`Updating "${imageId}": setting (${x}, ${y}) to ${colour}`);

    const imagePath = getImagePath(imageId);

    if (!fs.existsSync(imagePath)) {
        // TODO: Implement createImage
        console.log("Image doesn't exist yet.");
        res.end();
        return;
    }

    fs.readFile(imagePath, async (err, data) => {
        if (err) throw err;
        const img = await loadImage(data);
        const canvas = new Canvas(img.width, img.height);

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        ctx.fillStyle = colour;
        ctx.fillRect(x, y, 1, 1);

        const newImageBuffer = canvas.toBuffer('image/png');
        fs.writeFileSync(imagePath, newImageBuffer);
    })

    broadcastMessage(JSON.stringify({
        "event": "imageUpdate",
        "imageId": imageId
    }));

    res.json(req.body);

});


const isAlphanumeric = (s: string): boolean => {
    return !/^\w+$/.test(s);
}


const getImagePath = (imageId: string): string => {
    return `./assets/${imageId}.png`;
}

