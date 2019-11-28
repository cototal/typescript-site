import path from "path";

import express from "express";

import home from "./routes/home";

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 3e10 })
);

app.use("/", home);

export default app;
