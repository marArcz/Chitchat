import express from "express";
import { getAccount, login, registerUser } from "../controller/AuthController.js";

const router = express.Router();

router.post('/register', registerUser.validator(), registerUser.handler);
router.post('/login', login.validator(), login.handler);
router.post('/me', getAccount);

export default router;