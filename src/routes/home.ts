import express from "express";
const router = express.Router();
import { Request, Response } from "express";

router.get("/", (req: Request, res: Response) => {
    res.render("home/index", {
        title: "Home"
    });
})

export default router;
