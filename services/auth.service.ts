import AWS from 'aws-sdk';


export const auth = (accessKeyId: string, secretAccessKey: string, sessionToken: string) => {
    return new AWS.Credentials({ accessKeyId, secretAccessKey, sessionToken });
}