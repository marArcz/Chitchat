import AuthUser from "../lib/AuthUser.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const create = async (req, res) => {
    try {
        const { requesterId, recipientId } = req.body;

        const friendRequest = new FriendRequest({
            requester: requesterId,
            recipient: recipientId
        });

        await friendRequest.save();
        res.send({ friendRequest });
    } catch (error) {
        res.status(500).send({ 'error': error.message })
    }
}

export const getAll = async (req, res) => {
    try {
        const status = 'pending';
        const auth = AuthUser(req);

        if (auth.authenticated) {
            const user = auth.user
            const friendRequests = await FriendRequest.find({
                recipient: user._id,
                status
            });

            return res.send({ friendRequests });
        }

        res.status(400).send({ ...auth });
    } catch (error) {
        res.status(500).send({ 'error': error.message })
    }
}

// find friend request with user
export const findByUser = async (req, res) => {
    try {
        const auth = await AuthUser(req);
        if (auth.authenticated) {
            const userId = req.params.userId;
            const user = auth.user
            const friendRequest = await FriendRequest.findOne({
                recipient: { $in: [userId, user._id] },
                requester: { $in: [userId, user._id] },
                status: { $not: { $in: ['cancelled', 'declined'] } }
            }).populate(['requester', 'recipient']);

            return res.send({ friendRequest });
        }

        res.status(401).send(auth);
    } catch (error) {
        res.status(500).send({ 'error': error.message })
    }
}
export const findById = async (req, res) => {
    try {
        const id = req.params.id;
        const friendRequest = await FriendRequest.findById(id).populate(['requester', 'recipient']);

        return res.send({ friendRequest });

    } catch (error) {
        res.status(500).send({ 'error': error.message })
    }
}


export const update = async (req, res) => {
    try {
        const { id, status } = req.body;
        const friendRequest = await FriendRequest.findById(id);

        if (friendRequest) {
            friendRequest.status = status;
            await friendRequest.save()

            if (status === 'accepted') {
                const user1 = await User.findById(friendRequest.requester);
                const user2 = await User.findById(friendRequest.recipient);

                user1.friends.push(user2);
                user2.friends.push(user1);

                await user1.save();
                await user2.save();
            }
            return res.send({ friendRequest });
        }

        return res.status(404).send({ error: 'Cannot find friend request!' });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

export const unfriend = async (req, res) => {
    try {
        const id = req.params.id;
        const friendRequest = await FriendRequest.findByIdAndDelete(id);

        if (friendRequest) {
            const user1 = await User.findById(friendRequest.requester);
            const user2 = await User.findById(friendRequest.recipient);

            user1.friends = user1.friends.filter((friendId) => friendId != user2._id && friendId != user1._id)


            user2.friends = user2.friends.filter((friendId) => friendId != user1._id && friendId != user2._id)

            await user1.save();
            await user2.save();
            return res.send({ success: true });
        }

        return res.status(404).send({ error: 'Cannot find friend request!' });
    } catch (error) {
        return res.status(500).send({ 'error': error.message })
    }
}