import mongoose, {Document, Schema} from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
    email: string;
    fullName: string;
    password: string;
    profilePic: string;
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

//Hash password to store in db
userSchema.pre<IUser>("save", async function (next) {
    //Only hash function if modified
    if (!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error as Error);
    }
});

//Compare password in login
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
