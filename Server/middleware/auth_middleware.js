import jwt from "jsonwebtoken";
import UserModel from "../Models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const bannedWords = [
  "mua bán",
  "bán",
  "bán hàng",
  "giao dịch",
  "quảng cáo",
  "lừa đảo",
  "đặt cọc",
  "bán nhanh",
  "giảm giá",
  "khuyến mãi",
  "chuyển khoản",
  "con mẹ",
  "đả đảo",
  "cộng sản",
  "mua hàng",
];
