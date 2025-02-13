import mongoose from "mongoose";

const ContractSchema = new mongoose.Schema(
  {
    finder: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      images: [{ type: String }],
    },
    loser: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
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
