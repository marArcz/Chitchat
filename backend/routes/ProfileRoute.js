import express from "express";
import { Edit } from "../controller/ProfileController.js";

const router = express.Router();

router.post('/edit', Edit.validator(), Edit.handler);

export default router;