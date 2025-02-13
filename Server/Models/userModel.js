import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    contact: {
      type: Number,
    },
    profilePic: {
      type: String,
      default: "",
    },
    points: { type: Number, default: 0 }, // Điểm thưởng
    level: { type: String, default: "Thành viên mới" }, // Cấp độ
    badges: [{ type: String }], // Danh hiệu
    favoritesCount: {
      type: Number,
      default: 0,
    },
    followers: [],
    following: [],
    isBlocked: {
      type: Boolean,
      default: false, // Mặc định người dùng không bị chặn
    },
    blockExpires: { type: Date },
    provider: {
      type: String,
    },
    loginAttempts: { type: Number, default: 0 },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
