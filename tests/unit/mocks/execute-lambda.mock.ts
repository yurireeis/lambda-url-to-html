import { handler } from '../../../index';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';


export const executeLambda = async (url: string, name: string): Promise<APIGatewayProxyStructuredResultV2> => {
    const queryStringParameters = {};

    if (url) { queryStringParameters['url'] = url; }
    if (name) { queryStringParameters['name'] = name; }

    try {
        const res = await handler({
            queryStringParameters,
            version: '',
            routeKey: '',
            rawPath: '',
            rawQueryString: '',
            set headers(value) { this._headers = value; },
            set requestContext(value) { this._requestContext = value; },
            isBase64Encoded: false
        });

        return Promise.resolve(res);
    } catch (error) {
        return Promise.reject(error);
    }
}