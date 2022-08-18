import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { HTTP_STATUS } from './enums/status-code.enum';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { isEmpty } from 'lodash';


const BUCKET = 'lambda-url-to-html';
const s3Client = new S3Client({ region: 'us-east-2' });


export const storage = {
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

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    const body = {};
    const { queryStringParameters: { url: htmlUrl = '', name: fileName = '' } = {} } = event;

    if (isEmpty(htmlUrl) || isEmpty(fileName)) {
        body['details'] = 'url or name must be present at query string';
        return Promise.reject({ statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body });
    }

    try {
        const res = await axios.get(htmlUrl);
        body['title'] = cheerio.load(res.data)('head > title').text();
        body['s3Url'] = await storage.storeHtmlFile(res.data, fileName);
    } catch (error) {
        body['details'] = 'some error has ocurred';
        return Promise.reject({ statusCode: HTTP_STATUS.BAD_REQUEST, body });
    }

    return Promise.resolve({ statusCode: HTTP_STATUS.OK, body: JSON.stringify(body) });
};
