const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
app.use(express.static("../public"));
io.on("connection", socket => {
  socket.emit("test", { hello: "client" });
});
server.listen(8000, () => console.log("http://localhost:8000"));
