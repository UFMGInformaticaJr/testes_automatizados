require('dotenv').config();

const express = require('express');

const app = express();

const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(express.urlencoded({
  extended: true,
}));

app.use(express.json());

const router = require('../controllers/Controller');
app.use('/service', router);


module.exports = app;