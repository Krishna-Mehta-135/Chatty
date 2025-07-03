import Message from "../models/message.model";
import {User} from "../models/user.model";
import {ApiError} from "../utils/ApiError";
import {ApiResponse} from "../utils/ApiResponse";
import {asyncHandler} from "../utils/AsyncHandler";
import cloudinary from "../utils/Cloudinary";

const getUsersForSidebar = asyncHandler(async (req, res) => {
    //Get current user login id
    const loggedInUserId = req.user?._id;

    //Remove userid from sidebar users
    const filteredUsers = await User.find({
        _id: {
            $ne: loggedInUserId,
        },
    }).select("-password");

    if (!filteredUsers) {
        throw new ApiError(501, "Error in getUser controller");
    }

    res.status(200).json(new ApiResponse(200, filteredUsers));
});

const getMessages = asyncHandler(async (req, res) => {
    const {id: receiverId} = req.params;  //chatting user id

    const senderId = req.user?._id;  //my id

    //Find all message where i am the sender or the other user is the sender
    const messages = await Message.find({
        $or: [
            {senderId: senderId, receiverId: receiverId},
            {senderId: receiverId, receiverId: senderId},
        ],
    }).sort({ createdAt: 1 }) ;

    if(!messages){
        throw new ApiError(501, "Error in Messages Controller")
    }

    res.status(200).json(new ApiResponse(200 , messages))
});

const sendMessages = asyncHandler(async (req, res) => {
    const { text , image }  = req.body;
    const {id: receiverId} = req.params;  //chatting user id
    const senderId = req.user?._id

    //If image is sent
    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl
    })

    await newMessage.save();
    if(!newMessage){
        throw new ApiError(500, "Error is sending message")
    }

    //Realtime functionality is here => socket.io

    res.status(200).json(new ApiResponse(200, newMessage))
})

export {getUsersForSidebar, getMessages, sendMessages};
