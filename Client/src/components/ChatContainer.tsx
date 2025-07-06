import {useChatStore} from "../store/useChatStore";
import {useEffect, useRef} from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import {useAuthStore} from "../store/useAuthStore";
import {formatMessageTime} from "../lib/utils";

const ChatContainer = () => {
    const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages} =
        useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef = useRef<HTMLDivElement>(null); // Fix: Add type

    useEffect(() => {
        if (selectedUser?._id) {
            // Fix: Add null check
            getMessages(selectedUser._id);
        }

        if (subscribeToMessages) {
            // Fix: Add null check
            subscribeToMessages();
        }

        return () => {
            if (unsubscribeFromMessages) {
                // Fix: Add null check
                unsubscribeFromMessages();
            }
        };
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    // Fix: Add null check for selectedUser
    if (!selectedUser) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-xl font-medium mb-2">Welcome to Chat App</div>
                        <div className="text-base-content/60">Select a conversation to start messaging</div>
                    </div>
                </div>
            </div>
        );
    }

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUser?._id ? "chat-end" : "chat-start"}`} // Fix: Add null check
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser?._id // Fix: Add null check
                                            ? authUser?.profilePic || "/avatar.png"
                                            : selectedUser.profilePic || "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}

                {/* Scroll anchor */}
                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
