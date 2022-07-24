export const isAlphanumeric = (s: string): boolean => {
    return /^\w+$/.test(s);
}


export const getImagePath = (imageId: string): string => {
    return `./assets/${imageId}.png`;
}
