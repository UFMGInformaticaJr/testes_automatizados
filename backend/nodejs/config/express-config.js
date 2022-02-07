require('dotenv').config();

const express = require('express');

const app = express();

const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(express.urlencoded({
  extended: true,
}));

app.use(express.json());

const serviceRouter = require('../services/Service');
app.use('/service', serviceRouter);


module.exports = app;