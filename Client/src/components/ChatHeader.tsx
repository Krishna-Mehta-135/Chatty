import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    // Add null check for selectedUser
    if (!selectedUser) {
        return null; // or return a placeholder/loading state
    }

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img 
                                src={selectedUser.profilePic || "/avatar.png"} 
                                alt={selectedUser.fullName} 
                                className="object-cover"
                            />
                            {/* Online indicator */}
                            {onlineUsers.includes(selectedUser._id) && (
                                <span 
                                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                                    rounded-full ring-2 ring-zinc-900"
                                />
                            )}
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button 
                    onClick={() => setSelectedUser(null)}
                    className="btn btn-sm btn-circle btn-ghost"
                >
                    <X className="size-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;