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
const useragent = require("useragent"); // Accurately get user agent
const getIP = require("ipware")().get_ip;

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
  process.env.MONGODB_URI,
  {
    useMongoClient: true
  },
  err => {
    console.log("Mongoose error:" + err);
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

// Serve up analytics page
app.get("/analytics", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/analytics.html"));
});

// Returns shortened url from long url
app.post("/api/shorten", (req, res) => {
  let longUrl = req.body.url;
  let shortenedUrl = "";
  console.log("Shorten request");

  Url.findOne({ long_url: longUrl }, (err, doc) => {
    if (doc) {
      // URL has been shortened already
      shortenedUrl = config.webhost + bijective.encode(doc._id);
      console.log(shortenedUrl);
      // Return found url
      res.send({ shortenedUrl: shortenedUrl });
    } else {
      // URL needs to be shprtened
      newUrl = Url({
        long_url: longUrl,
        clicked: 0,
        users: {}
      });
      // Save the new link
      newUrl.save(err => {
        if (err) {
          console.log(err);
        }
        // Shorten URL
        shortenedUrl = config.webhost + bijective.encode(newUrl._id);
        console.log(shortenedUrl);
        res.send({ shortenedUrl: shortenedUrl });
      });
    }
  });
});

// Redirect user to original url
app.get("/:encoded_id", (req, res) => {
  let encodedId = req.params.encoded_id;
  let id = bijective.decode(encodedId);
  console.log("Unshorten");
  // Get client User Agent
  const userAgent = useragent.lookup(req.headers["user-agent"]);

  // Get Device
  const device = userAgent.device.toString();

  // Get OS
  const os = userAgent.os.toString();

  // Get Browser
  const browser = userAgent.family.toString();

  // Get current date
  const currentDate = new Date();
  // Get client IP
  const ip = getIP(req).clientIp;

  // Check if url exists
  Url.findOneAndUpdate(
    { _id: id },
    {
      $inc: { clicked: 1 },
      $push: {
        users: {
          ip: ip,
          timestamp: currentDate,
          device: device,
          os: os,
          browser: browser
        }
      }
    },
    (err, doc) => {
      if (doc) {
        // Redirect to long url

        // User forgot to include www or http(s) when creating shortened url, prefix url to properly redirect

        res.redirect(doc.long_url);
      } else {
        // Send 404 if not found
        res.sendStatus(404);
      }
    }
  );
});

// Returns analytics data
app.post("/api/analyze", (req, res) => {
  console.log("Analyze");
  let url = req.body.url;
  let shorturlindex = url.lastIndexOf("/");
  let shorturl = url.substring(shorturlindex + 1);

  let id = bijective.decode(shorturl);

  Url.findOne({ _id: id }, (err, doc) => {
    if (doc) {
      // Send analytics data
      let analyticsData = {
        clicked: doc.clicked,
        users: doc.users
      };
      res.send(analyticsData);
    }
  });
});

module.exports = app;
