import bcrypt from "bcrypt";
import mongoose from "mongoose";

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => any) => void;

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;

    profile: {
        name: string;
    }

    comparePassword: comparePasswordFunction;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    profile: {
        name: String
    }
}, { timestamps: true });

userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    })
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

export const User = mongoose.model<UserDocument>("User", userSchema);
