import { strictEqual } from 'assert';

import axios from 'axios';
import { stub, restore } from 'sinon';
import { describe, it, afterEach } from 'mocha';

import { storage } from '../../index';
import { HTTP_STATUS } from '../../enums/status-code.enum';
import { executeLambda } from './mocks/execute-lambda.mock';


// hook: after each test, restore stub condition
afterEach(restore);

describe('ingest html lambda function tests', () => {

    it('should retrieve html from an url', async () => {

        // arrange
        const url = 'https://helloworld.com';
        const s3FileUrl = 'https://s3fileurl.com';
        const title = 'Hello World!!!';
        const filename = 'filename';
        const htmlData = `<html><head><title>${title}</title></head></html>`;

        // act
        stub(axios, 'get').resolves({ data: htmlData });
        stub(storage, 'storeHtmlFile').resolves(s3FileUrl);
        const res = await executeLambda(url, filename);
        const body = JSON.parse(res.body || '');

        // assert
        strictEqual(res.statusCode, HTTP_STATUS.OK);
        strictEqual(body.title, title);
        strictEqual(body.s3Url, s3FileUrl);
    });

    it('should reject promise because of empty url', async () => {

        // arrange
        let error = {};
        const url = '';
        const s3FileUrl = 'https://s3fileurl.com';
        const title = 'Hello World!!!';
        const filename = 'filename';
        const htmlData = `<html><head><title>${title}</title></head></html>`;

        // act
        stub(axios, 'get').resolves({ data: htmlData });
        stub(storage, 'storeHtmlFile').resolves(s3FileUrl);

        try {
            await executeLambda(url, filename);
        } catch (err) {
            error = err;
        }

        // assert
        strictEqual(error['statusCode'], HTTP_STATUS.UNPROCESSABLE_ENTITY);
    });

    it('should reject promise because of empty filename', async () => {

        // arrange
        let error = {};
        const url = 'https://someurlgoeshere.com';
        const s3FileUrl = 'https://s3fileurl.com';
        const title = 'Hello World!!!';
        const filename = '';
        const htmlData = `<html><head><title>${title}</title></head></html>`;

        // act
        stub(axios, 'get').resolves({ data: htmlData });
        stub(storage, 'storeHtmlFile').resolves(s3FileUrl);

        try {
            await executeLambda(url, filename);
        } catch (err) {
            error = err;
        }

        // assert
        strictEqual(error['statusCode'], HTTP_STATUS.UNPROCESSABLE_ENTITY);
    });

    it('should reject promise because of both empty url and filename', async () => {

        // arrange
        let error = {};
        const url = '';
        const s3FileUrl = 'https://s3fileurl.com';
        const title = 'Hello World!!!';
        const filename = '';
        const htmlData = `<html><head><title>${title}</title></head></html>`;

        // act
        stub(axios, 'get').resolves({ data: htmlData });
        stub(storage, 'storeHtmlFile').resolves(s3FileUrl);

        try {
            await executeLambda(url, filename);
        } catch (err) {
            error = err;
        }

        // assert
        strictEqual(error['statusCode'], HTTP_STATUS.UNPROCESSABLE_ENTITY);
    });

});