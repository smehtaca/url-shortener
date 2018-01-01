// app.js

const express = require("express");
const app = express();
const path = require("path"); // Path Module for concatenating file paths
var bodyParser = require("body-parser"); // Body parser for parsing JSON
const mongoose = require("mongoose");
const config = require("./config"); // Config file
const bijective = require("./src/bijective.js");
const Url = require("./models/url"); // Url Model
const favicon = require("serve-favicon"); // Favicon

// Use CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Connect to DB
let mongo = mongoose.connect(
  "mongodb://" + config.db.host + "/" + config.db.name,
  {
    useMongoClient: true
  }
);

// Use bodyparser to parse json and url encoded body data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve favicon
app.use(favicon(path.join(__dirname, "public", "img", "favicon.ico")));
// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Serve up homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

// Returns shortened url from long url
app.post("/api/shorten", (req, res) => {
  let longUrl = req.body.url;
  let shortenedUrl = "";

  Url.findOne({ long_url: longUrl }, (err, doc) => {
    if (doc) {
      // URL has been shortened already
      shortenedUrl = config.webhost + bijective.encode(doc._id);
      // Return found url
      res.send({ shortenedUrl: shortenedUrl });
    } else {
      // URL needs to be shprtened
      newUrl = Url({
        long_url: longUrl
      });
      // Save the new link
      newUrl.save(err => {
        if (err) {
          console.log(err);
        }
        // Shorten URL
        shortenedUrl = config.webhost + bijective.encode(newUrl._id);
        res.send({ shortenedUrl: shortenedUrl });
      });
    }
  });
});

// Redirect user to original url
app.get("/:encoded_id", (req, res) => {
  let encodedId = req.params.encoded_id;
  let id = bijective.decode(encodedId);

  // Check if url ecists
  Url.findOne({ _id: id }, (err, doc) => {
    if (doc) {
      // Redirect to long url

      // User forgot to include www or http(s) when creating shortened url, prefix url to properly redirect
      if (
        !doc.long_url.includes("http") ||
        !doc.long_url.includes("https") ||
        !doc.long_url("www")
      ) {
        res.redirect("https://" + doc.long_url);
      } else {
        res.redirect(doc.long_url);
      }
    } else {
      // Send 404 if not found
      res.sendStatus(404);
    }
  });
});
module.exports = app;
