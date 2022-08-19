import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { isEmpty } from 'lodash';

import { store } from './services/storage.service';
import { HTTP_STATUS } from './enums/status-code.enum';


export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    const body = {};
    const { queryStringParameters: { url: htmlUrl = '', name: fileName = '' } = {} } = event;

    
    if (isEmpty(htmlUrl) || isEmpty(fileName)) {
        body['details'] = 'url or name must be present at query string';
        return Promise.resolve({ statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: JSON.stringify(body) });
    }

    try {
        const res = await axios.get(htmlUrl);
        body['title'] = cheerio.load(res.data)('head > title').text();
        body['s3Url'] = await store.storeHtmlFile(res.data, fileName);
    } catch (error) {
        return Promise.resolve({ statusCode: HTTP_STATUS.BAD_REQUEST, body: JSON.stringify(error) });
    }

    return Promise.resolve({ statusCode: HTTP_STATUS.OK, body: JSON.stringify(body) });
};
