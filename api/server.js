const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const db = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/jokes', db.authenticate, jokesRouter);

module.exports = server;
