// server.js

// Require App
const server = require("./app");

// Socket.io setup
const http = require("http").Server(server);
const io = require("socket.io")(http);

// Store data about current active users
let activeVisitors = {};

io.on("connection", socket => {
  // User visit
  socket.on("setVisitorData", data => {
    activeVisitors[socket.id] = data;
  });

  // User has left
  socket.on("disconnect", () => {
    delete activeVisitors[socket.id];
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port: " + process.env.PORT);
});
