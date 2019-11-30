import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";

export const init = () => {
    passport.serializeUser<any, any>((user, done) => {
        done(undefined, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({ email }, (err, user) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }

            user.comparePassword(password, (err: Error, isMatch: boolean) => {
                if (err) { return done(err) }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Incorrect password." });
                }
            })
        })
    }));
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
}
