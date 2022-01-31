require('dotenv').config();

const port = process.env.port;

const express = require('express');

const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.urlencoded({
  extended: true,
}));

app.use(express.json());

app.listen(port, console.log(`API listening on port ${port}`));


module.exports = app;