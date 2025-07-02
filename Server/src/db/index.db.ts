import mongoose from "mongoose";

export const connectDb = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI as string )
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error : unknown) {
        console.log(`MongoDb connection error : ${error}`);
        process.exit(1)
    }
}