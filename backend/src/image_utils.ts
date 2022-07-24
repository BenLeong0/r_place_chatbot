import { Canvas, loadImage } from 'canvas';
import * as fs from 'fs';

import { fileExists } from './utils';


export const generateNewImage = (
    imagePath: string,
    width: number = 20,
    height: number = 20,
    colour: string | undefined = undefined,
): void => {
    const canvas = new Canvas(width, height);
    const ctx = canvas.getContext('2d');

    if (typeof colour === "undefined") {
        // Create standard white/grey "transparent" grid
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                ctx.fillStyle = (x + y) % 2 ? "#DFDFDF" : "#FFFFFF";
                ctx.fillRect(x, y, 1, 1);
            }
        }
    } else {
        ctx.fillStyle = colour;
        ctx.fillRect(0, 0, width, height);
    }

    const newImageBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, newImageBuffer);
}


export const generateNewImageIfFileNonExistent = (imagePath: string): void => {
    if (!fileExists(imagePath)) {
        console.log(`Generating image at ${imagePath}`);
        generateNewImage(imagePath);
    }
}


export const updateImage = (
    imagePath: string,
    colour: string,
    x: number,
    y: number,
): void => {
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
}
