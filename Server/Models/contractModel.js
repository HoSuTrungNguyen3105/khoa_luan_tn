import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema(
  {
    finder: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      images: [{ type: String }], // Ảnh chứng minh đồ vật
    },
    loser: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const ContractModel = mongoose.model("Contract", ContractSchema);
export default ContractModel;
