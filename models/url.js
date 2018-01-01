// MongoDB Database Model

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define counter collection schema with and _id field and a seq field
const counterSchema = Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Define user schema for tracking users
const userSchema = Schema({
  ip: String,
  timestamp: Date,
  device: String,
  os: String,
  browser: String
});

// Define url schema for links
const urlSchema = Schema({
  _id: { type: Number, index: true },
  long_url: String,
  clicked: Number,
  users: [userSchema],
  created_at: Date
});

// Create counter model
let counter = mongoose.model("counter", counterSchema);

let user = mongoose.model("user", userSchema);

// PreSave middleware to update url count before saving url
urlSchema.pre("save", function(next) {
  //Only update if it is a new model instance
  if (this.isNew) {
    let doc = this;
    // Find and increate url_count

    counter.findByIdAndUpdate(
      { _id: "url_count" },
      { $inc: { seq: 1 } },
      (error, counter) => {
        if (error) return next(error);

        // Set the _id of the url to be incremented value of url_count
        doc._id = counter.seq;
        doc.created_at = new Date();
        next();
      }
    );
  }
});

//Create Model from Url Schema
const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
