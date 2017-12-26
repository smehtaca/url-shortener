// server.js

// Require App
const server = require("../src/app");

// Socket.io setup
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Store data about current active users
let activeVisitors = {};

io.on("connection", function(socket) {
  // User visit
  socket.on("setVisitorData", data => {
    activeVisitors[socket.id] = data;
  });

  // User has left
  socket.on("disconnect", () => {
    delete activeVisitors[socket.id];
  });
});

server.listen(3000, function() {
  console.log("Server listening on port 3000");
});
