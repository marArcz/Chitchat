import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username:{
        type:String,
        default:''
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        default: ''
    },
    pronoun: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    matchUpPreferences: {
        pronoun: {
            type: String,
            default: 'both'
        }
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model("users", userSchema);

export default User;