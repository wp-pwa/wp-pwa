/* eslint-disable global-require, no-console, no-restricted-syntax, no-await-in-loop,
import/no-dynamic-require */
const { readFile, pathExists, readdir } = require('fs-extra');
const express = require('express');
const noFavicon = require('express-no-favicons');

const createServer = async app => {
  if (process.env.HTTPS_SERVER) {
    const server = require('https').createServer;
    const options = {
      key: await readFile('core/certs/localhost.key'),
      cert: await readFile('core/certs/localhost.crt'),
    };
    return server(options, app);
  }
  const server = require('http').createServer;
  return server(app);
};

const createApp = async () => {
  // Create the server.
  const app = express();
  app.use(noFavicon());
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  // Add static files.
  app.use('/static', express.static(`.build/${process.env.MODE}/client/`));
  // Add dynamic files.
  const packages = await readdir('packages');
  for (const pkg of packages) {
    if (await pathExists(`packages/${pkg}/src/${process.env.MODE}/server/index.js`)) {
      const pkgServer = require(`../../packages/${pkg}/src/${process.env.MODE}/server/index.js`);
      app.use(`/dynamic/${pkg}`, pkgServer);
    }
  }

  // Create a function to start listening after webpack has finished.
  let isBuilt = false;
  const server = await createServer(app);
  const done = () =>
    !isBuilt &&
    server.listen(3000, () => {
      isBuilt = true;
      console.log(
        `\nSERVER STARTED (${process.env.MODE}) -- Listening @ ${
          process.env.HTTPS_SERVER ? 'https' : 'http'
        }://localhost:3000`,
      );
    });
  return { app, done };
};

const serve = async () => {
  const { app, done } = await createApp();

  // Check if a build has been generated.
  if (!await pathExists(`.build/${process.env.MODE}/buildInfo.json`))
    throw new Error(`No build found. Please, run 'npm run build:${process.env.MODE}' first.`);

  // Inform about the type of build which is going to be served.
  const { nodeEnv } = require(`../../.build/${process.env.MODE}/buildInfo.json`);
  if (nodeEnv !== process.env.NODE_ENV)
    throw new Error(
      `ATTENTION: Your build is for ${nodeEnv} but you started serve in ${
        process.env.NODE_ENV
      }! Please, build or serve again.`,
    );

  // Start server with the clientStats.
  const clientStats = require(`../../.build/${process.env.MODE}/clientStats.json`); // eslint-disable-line
  const serverRender = require(`../../.build/${process.env.MODE}/server/main.js`).default; // eslint-disable-line
  app.use(serverRender({ clientStats }));
  done();
};

module.exports = {
  createApp,
  serve,
};
