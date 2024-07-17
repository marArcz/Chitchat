import expressAsyncHandler from "express-async-handler";
import AuthUser from "../lib/AuthUser.js";
import Conversation from "../models/Conversation.js";

export const getAll = async (req, res) => {
  try {
    const auth = await AuthUser(req);
    const conversations = await Conversation.find({ users: auth.user._id, })
      .limit(10)
      .sort({ _id: -1 })
      .populate('messages')
      .populate('users')
      .exec();

    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}