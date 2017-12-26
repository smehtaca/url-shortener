// server.js

// Require App
const server = require("./app");

server.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port: " + process.env.PORT);
});
