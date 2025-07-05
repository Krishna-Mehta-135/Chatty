import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import toast from "react-hot-toast";

interface User {
    _id: string;
    email: string;
    fullName: string;
    profilePic?: string;
    createdAt?: string;
}

interface SignupInput {
    fullName: string;
    email: string;
    password: string;
}
interface SigninInput {
    email: string;
    password: string;
}

interface AuthState {
    authUser: User | null;
    isSigningUp: boolean;
    isLogging: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;

    checkAuth: () => Promise<void>;
    signup: (data: SignupInput) => Promise<void>;
    logout: () => Promise<void>;
    login: (data: SigninInput) => Promise<void>;
    updateProfile: (data: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLogging: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
        } catch (error) {
            console.error("Error in checkAuth:", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/register", data);
            toast.success("Account created successfully");
            set({authUser: res.data});
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Signup failed");
        } finally {
            set({isSigningUp: false});
        }
    },

    login: async (data) => {
        set({isLogging: true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            toast.success("Login successful");
            set({authUser: res.data});
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
        } finally {
            set({isLogging: false});
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logout successful");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    },

    updateProfile: async(data) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put("auth/update-profile", data)
            set({authUser: res.data})
            toast.success("Profile updated sudccessfully")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Upload failed");
        }finally{
            set({isUpdatingProfile: false})
        }
    }
}));
