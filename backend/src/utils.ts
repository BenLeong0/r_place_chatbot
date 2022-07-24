import * as fs from 'fs';


export const isAlphanumeric = (s: string): boolean => {
    return /^\w+$/.test(s);
}


export const getImagePath = (imageId: string): string => {
    return `./assets/${imageId}.png`;
}


export const fileExists = (imagePath: string): boolean => {
    return fs.existsSync(imagePath);
}
