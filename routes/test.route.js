import express from "express";
import { shouldBeAdmin } from "../controllers/test.controller.js";


import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

 const shouldBeLoggedIn = async (req, res) => {
    console.log(req.userId)
    res.status(200).json({ message: "You are Authenticated" });
  };

router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);

router.get("/should-be-admin", shouldBeAdmin);

export default router;
