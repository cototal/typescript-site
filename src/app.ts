import path from "path";

import errorHandler from "errorhandler";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import * as http from "http";
import * as socketio from "socket.io";

import home from "./routes/home";

dotenv.config({ path: ".env" });

const app = express();
const server = new http.Server(app);
const port = process.env.SOCKETIO_PORT || 3000;
const io = socketio.default(server);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connection ready.");
}).catch(err => {
    console.log("MongoDB connection error. ", err);
});

server.listen(port, () => {
    console.log("  App is running");
});

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(
    express.static(path.join(__dirname, "../public"), { maxAge: 3e10 })
);

app.use("/", home);

app.use(errorHandler());

io.on("connection", socket => {
    socket.emit("news", { hello: "World" });
});
