// app.js

// Require Express
const express = require("express");
// Init App
const app = express();

// Path Module for concatenating file paths
const path = require("path");

// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Serve up homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

module.exports = app;
