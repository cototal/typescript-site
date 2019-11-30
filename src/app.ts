import path from "path";
import fs from "fs";

import bodyParser from "body-parser";
import connectMongo from "connect-mongo";
import errorHandler from "errorhandler";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import * as http from "http";
import * as socketio from "socket.io";

import { init as psConfigInit } from "./auth/config";
import home from "./routes/home";
import auth from "./routes/auth";

dotenv.config({ path: ".env" });

const app = express();
const server = new http.Server(app);
const port = process.env.SOCKETIO_PORT || 3000;
const io = socketio.default(server);
const MongoStore = connectMongo(session);

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
psConfigInit();

app.use(
    express.static(path.join(__dirname, "../public"), { maxAge: 3e10 })
);

app.use((req, res, next) => {
    res.locals.assets = (name: string) => {
        const manifest = fs.readFileSync(path.join(__dirname, "..", "public", "build", "manifest.json"), "utf8");
        const data = JSON.parse(manifest);
        if (null == data[name]) {
            return `not-found`;
        }
        return data[name];
    }
    next();
});

app.use("/", home);
app.use("/auth", auth);

app.use(errorHandler());

io.on("connection", socket => {
    socket.emit("news", { hello: "World" });
});
