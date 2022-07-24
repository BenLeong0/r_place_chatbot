import 'dotenv/config';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';

import { getImagePath } from './utils';


const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({ region, accessKeyId, secretAccessKey });


export async function uploadImage(imageId: string) {
    const imagePath = getImagePath(imageId);
    const fileStream = fs.createReadStream(imagePath);

    if (typeof bucketName === "undefined") {
        console.log("Bucket name not assigned");
        return Promise.resolve();
    }

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: imageId,
    };

    return s3.upload(uploadParams).promise();
}


export function downloadImage(imageId: string): void {
    const imagePath = getImagePath(imageId);

    if (typeof bucketName === "undefined") {
        console.log("Bucket name not assigned");
        return;
    }

    const downloadParams = {
        Bucket: bucketName,
        Key: imageId,
    };

    console.log(s3.getObject(downloadParams))
    const readStream = s3.getObject(downloadParams).createReadStream();
    console.log(readStream)
    const writeStream = fs.createWriteStream(imagePath);
    readStream.pipe(writeStream);
}
