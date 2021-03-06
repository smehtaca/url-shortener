// Base 58 alphabet(alphanumeric with 0, I and O removed so that url is not confusing)
const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const base = alphabet.length;

// Returns base 58 string from base 10 integer(unique url number generated by database)
const encode = num => {
  let encoded = "";
  while (num) {
    let reminder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[reminder].toString() + encoded;
  }
  return encoded;
};

// Returns a base 10 integer from a base 58 string
const decode = base58str => {
  let decoded = 0;
  while (base58str) {
    let index = alphabet.indexOf(base58str[0]);
    let power = base58str.length - 1;
    decoded += index * Math.pow(base, power);
    base58str = base58str.substring(1);
  }
  return decoded;
};

module.exports.encode = encode;

module.exports.decode = decode;
