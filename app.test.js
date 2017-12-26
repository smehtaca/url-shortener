// app.test.js
// Tests for api endpoints go here
// Require puppeteer for UI Testing
const puppeteer = require("puppeteer");
// Require supertest
const request = require("supertest");
//Require App
const app = require("./app");

let page;
let browser;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/");
});
afterAll(() => {
  browser.close();
});

describe("Test the frontend", () => {
  test(
    "Header should be URL Shortener",
    async () => {
      const title = await page.title();
      expect(title).toBe("URL Shortener");
    },
    25000
  );
});

describe("Test the frontend", () => {
  test(
    "Check that a url input field exists",
    async () => {
      const urlElement = await page.$eval("#url", el => (el ? true : false));
      expect(urlElement).toBe(true);
    },
    25000
  );
});
