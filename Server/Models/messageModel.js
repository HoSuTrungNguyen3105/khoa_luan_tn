import mongoose from "mongoose";

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
    },
    reports: {
      type: [
        {
          reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          reportedAt: { type: Date, default: Date.now },
        },
      ],
      default: [], // Thêm giá trị mặc định là mảng rỗng
    },
  },
  {
    timestamps: true,
  }
);

var messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
