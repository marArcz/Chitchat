import expressAsyncHandler from "express-async-handler";
import AuthUser from "../lib/AuthUser.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

export const getAll = async (req, res) => {
    try {
        const auth = await AuthUser(req);
        const user = auth.user;
        user.populate('friends', '_id');
        const friendIds = user.friends.map(friend => friend._id);

        let conversations = await Conversation.find({
            users: { $all: [user._id], $in: friendIds }
        })
            .limit(10)
            .sort({ _id: -1 })
            .populate('users')
            .populate({
                path: 'messages',
                limit: 1,
                sort: { createdAt: -1 }
            })
            .exec()

        res.status(200).json({ conversations });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}