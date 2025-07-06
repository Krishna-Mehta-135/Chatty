import toast from "react-hot-toast";
import {create} from "zustand";
import {axiosInstance} from "../lib/axios";

interface User {
    _id: string;
    email: string;
    fullName: string;
    profilePic?: string;
}

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    createdAt: string;
}

interface ChatState {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (messageData: {text?: string; image?: string}) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/message/users");
            set({users: res.data.data}); // Adjust based on your API response structure
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Users not found");
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId: string) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages: res.data.data}); // Adjust based on your API response structure
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load messages");
        } finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData: {text?: string; image?: string}) => {
        const {selectedUser} = get();
        if (!selectedUser) return;

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: [...get().messages, res.data.data]});
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    },

    setSelectedUser: (user: User | null) => {
        set({selectedUser: user});
    },
}));
