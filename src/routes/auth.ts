import express from "express";
import passport from "passport";

import { Request, Response } from "express";

import { User, UserDocument } from "../models/User";
import { Error } from "mongoose";

const router = express.Router();

router.get("/login", (req: Request, res: Response) => {
    res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login"
}));

router.get("/register", (req: Request, res: Response) => {
    res.render("auth/register");
});

router.post("/register", (req: Request, res: Response) => {
    console.log(req.body);
    User.create({
        email: req.body.email,
        password: req.body.password,
        profile: {
            name: req.body.name
        }
    }, (err: Error, doc: UserDocument) => {
        console.log(doc);
        res.redirect("/auth/login");
    });
})

export default router;
