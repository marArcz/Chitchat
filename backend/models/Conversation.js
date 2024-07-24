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
    },
}, {toJSON:{virtuals:true}, toObject: {virtuals:true}})

conversationSchema.virtual('messages',{
    ref:'messages',
    foreignField:'conversationId',
    localField:'_id',
})

const Conversation = mongoose.model("conversations", conversationSchema);
export default Conversation;