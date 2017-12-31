// server.js

// Require App
const server = require("./app");
const port = process.env.PORT === undefined ? 3000 : process.env.PORT;
server.listen(port, () => {
  console.log("Server listening on port: " + port);
});
