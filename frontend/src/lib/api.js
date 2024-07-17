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
        const res = await axios.get('/conversations/all',{withCredentials:true});
        console.log(res)
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateUserProfile = async (user) => {
    try {
        console.log('update profile: ', user)
        const res = await axios.post('/profile/edit',{...user},{withCredentials:true})
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
}