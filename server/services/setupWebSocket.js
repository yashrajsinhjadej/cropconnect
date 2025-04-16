const Product = require("../models/productSchema");

function setupWebSocket(io) {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = { setupWebSocket };
