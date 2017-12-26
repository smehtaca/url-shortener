// app.js

const express = require("express");
const app = express();
const path = require("path"); // Path Module for concatenating file paths
const bodyParser = require('body-parser'); // Body parser for parsing JSON
const mongoose = require('mongoose');
const config = require('./config'); // Config file
const bijective = require('//src/bijective.js');
const Url = require('./models/url'); // Url Model


// Use bodyparser to parse json and URL encoded body data
app.use(bodyParser.json);
app.use(bodyParser.urlencoded({ extended: true });


// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Serve up homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// Returns shortened url from long url
app.get("/shorten" (req,res) => {

});

module.exports = app;
