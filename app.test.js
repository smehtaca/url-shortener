// app.test.js
// Tests for api endpoints go here

// Require supertest
const request = require("supertest");

//Require App
const app = require("./app");

describe("Test the root path", () => {
  test("It should return the GET method", () => {
    return request(app)
      .get("/")
      .expect(200);
  });
});
