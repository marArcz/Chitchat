import { create } from 'zustand'
import { getAllConversations } from '../lib/api'

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