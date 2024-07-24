import axios from "axios";

export const createAccount = async (account) => {
    try {
        const res = await axios.post('/auth/register', { ...account }, { withCredentials: true });
        return res;
    } catch (error) {
        throw error;
    }
}
export const signIn = async (email, password) => {
    try {
        const res = await axios.post('/auth/login', {
            email,
            password,
        }, { withCredentials: true });

        return res;
    } catch (error) {
        throw error;
    }
}

export const getCurrentUser = async () => {
    try {
        const response = await axios.post('/auth/me', {}, { withCredentials: true })
        return response.data.user;
    } catch (error) {
        console.error(error)
        return null;
    }
}

export const signOut = () => {
    try {
        return true
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getAllConversations = async () => {
    try {
        const res = await axios.get('/conversations/all', { withCredentials: true });
        console.log(res)
        return res.data.conversations;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateUserProfile = async (user) => {
    try {
        console.log('update profile: ', user)
        const res = await axios.post('/profile/edit', { ...user }, { withCredentials: true })
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const findFriendRequestById = async (id) => {
    try {
        const res = await axios.get(`/friend-requests/${id}/find-by-id`);

        return res.data.friendRequest;

    } catch (error) {
        console.log('Error finding friend Request by User: ', error);
        throw error;
    }
}
export const findFriendRequestByUser = async (userId) => {
    try {
        const res = await axios.get(`/friend-requests/${userId}/find-by-user`);

        return res.data.friendRequest;

    } catch (error) {
        console.log('Error finding friend Request by User: ', error);
        throw error;
    }
}

export const addFriend = async (requesterId, recipientId) => {
    try {
        const res = await axios.post('/friend-requests/create', { requesterId, recipientId });

        return res.data.friendRequest;
    } catch (error) {
        console.log('Error adding friend: ', error);
        throw error;
    }
}

export const updateFriendRequest = async (id, status) => {
    try {
        const res = await axios.patch('/friend-requests/update', { id, status });
        return res.data.friendRequest;
    } catch (error) {
        console.log('Error updating friend request: ', error)
        throw error;
    }
}

export const unfriend = async (id) => {
    try {
        const res = await axios.delete(`/friend-requests/${id}/unfriend`);
        return res;
    } catch (error) {
        console.log('Error in unfriend: ', error)
        throw error;
    }
}

export const getFriends = async () => {
    try {
        const res = await axios.get('/friends');
        return res.data.friends;
    } catch (error) {
        console.log('Error in getting friends: ', error);
        throw error;
    }
}