import mongoose from "mongoose"

const messageSchema = mongoose.Schema(
{
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    }
},
{
    timestamps : true
});

var messageModel = mongoose.model('Message', messageSchema)

export default messageModel 