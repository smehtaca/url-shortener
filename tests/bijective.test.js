//Tests for URL encoding and decoding go here

const url = require("../src/bijective");

describe("Test the url encode and decode functions", () => {
  test("URL encode should return an encoded string", () => {
    let num = 9999;
    let base58 = "3Yp";
    let result = url.encode(num);
    return expect(result).toBe(base58);
  });
});

describe("Test the url encode and decode functions", () => {
  test("URL decode should return a decoded integere", () => {
    let base58 = "3Yp";
    let num = 9999;
    let result = url.decode(base58);
    return expect(result).toBe(num);
  });
});
