import { create } from 'zustand'
import { getAllConversations, getFriends } from '../lib/api'

export const useConversationStore = create((set) => ({
    conversations: [],
    loading: false,
    error: null,
    fetchAllConversations: async () => {
        try {
            set({ loading: true, error: null })
            const conversations = await getAllConversations();
            set({ loading: false, conversations });
        } catch (error) {
            console.log(error)
            set({ loading: false, error: error.message })
        }
    }
}))

export const useFriendStore = create((set) => ({
    friends: [],
    loading: false,
    error: null,
    fetchAllFriends: async () => {
        try {
            set({ loading: true, error: null })
            const friends = await getFriends();
            console.log('friends: ', friends)
            set({ loading: false, friends });
        } catch (error) {
            console.log('error getting friends',error)
            set({ loading: false, error: error.message })
        }
    }
}))