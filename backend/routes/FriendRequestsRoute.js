import express from "express";
import { create, unfriend, findByUser, getAll, update, findById } from "../controller/FriendRequestController.js";

const router = express.Router();

router.get('/', getAll);
router.get('/:userId/find-by-user', findByUser);
router.get('/:id/find-by-id', findById);
router.post('/create', create);
router.patch('/update', update);
router.delete('/:id/unfriend', unfriend);

export default router;