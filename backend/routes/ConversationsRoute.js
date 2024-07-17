import express from "express";
import { getAll } from "../controller/ConversationsControllers.js";

const router = express.Router();

router.get('/all',getAll);

export default router;