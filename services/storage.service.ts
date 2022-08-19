import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';


const BUCKET = 'lambda-url-to-html-dotdash-meredith';
const s3Client = new S3Client({ region: 'us-east-1' });

export const store = {
    storeHtmlFile: async (content: string, name: string): Promise<string> => {
        const key = `${name}.html`;
        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: Buffer.from(content),
            ContentType: 'text/html'
        });
        await s3Client.send(command);
        return `https://${BUCKET}.s3.amazonaws.com/${key}`;
    }
};