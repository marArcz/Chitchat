import AuthUser from "../lib/AuthUser.js";
import User from "../models/User.js";

export const getAll = async (req, res) => {
    try {
        const auth = await AuthUser(req);

        if (auth.authenticated) {
            const user = await User.findById(auth.user._id).populate('friends');
            return res.send({ friends: user.friends });
        }

        return res.status(401).send(auth);

    } catch (error) {
        return res.status(500).send(error);
    }
}