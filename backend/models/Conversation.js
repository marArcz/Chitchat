import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    type: { //can be 'private' or 'group'
        type: String,
        default: 'private'
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    name:{
        type:String,
        default:''
    }
})

conversationSchema.virtual('messages',{
    ref:'messages',
    localField:'_id',
    foreignField:'conversationId'
})

const Conversation = mongoose.model("conversations", conversationSchema);
export default Conversation;