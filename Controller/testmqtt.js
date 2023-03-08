import http from "http";
import { db } from "../Config/db.js";
const server = http.createServer();
import { Server } from "socket.io";
const io = new Server(server);

const testmqtt = () => {
  io.on("connection", (socket) => {
    console.log("client connect");
    // Check if the socket is connected
    if (socket.connected) {
      console.log("Socket is connected");
    } else {
      console.log("Socket is not connected");
    }
    db.query("SELECT * FROM trip_summary", (error, results) => {
      if (error) return error;
      socket.emit("data", results);
    });
  });
};

export default testmqtt;
