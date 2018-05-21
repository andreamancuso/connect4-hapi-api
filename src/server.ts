'use strict';
import * as fs from 'fs';
import * as glue from "glue";

const nodeEnv = process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : '';
const pathToManifest = fs.existsSync(`${__dirname}/../config.${nodeEnv}.json`) ? `../config.${nodeEnv}.json` : '../config.json';

const manifest = require(pathToManifest);
const options = { relativeTo: __dirname };

async function start() {
    try {
        const server = await glue.compose(manifest, options);

        await server.start();

        console.log('Server running at: ', server.info.uri)
    } catch (err) {
        console.error(err)
    }
}

start();
