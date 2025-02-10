import UserModel from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import messageModel from "../Models/messageModel.js";
import nodemailer from "nodemailer";

export const dataRoute = async (req, res) => {
  const { role } = req.query;

  try {
    const users = await UserModel.find({ role }); // Lọc theo role
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

export const registerUser = async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }
    // Validate email format (you can use a regular expression for this)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email không đúng định dạng" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase(); // Mã 6 ký tự
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Hết hạn sau 15 phút

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      verificationCode,
      verificationCodeExpires,
    });

    await newUser.save();

    // Gửi mã xác thực qua email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "trungnguyenhs3105@gmail.com",
        pass: "ugtu fnsp xbqa vdff",
      },
    });

    const mailOptions = {
      from: "trungnguyenhs3105@gmail.com",
      to: email,
      subject: "Xác thực tài khoản",
      text: `Mã xác thực của bạn là: ${verificationCode}. Mã này sẽ hết hạn sau 15 phút.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Tài khoản đã được tạo. Vui lòng kiểm tra email để xác thực.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, isAdminLogin } = req.body;

  try {
    // Kiểm tra nếu thiếu thông tin đầu vào
    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu!",
      });
    }

    // Tìm kiếm người dùng trong cơ sở dữ liệu
    const user = await UserModel.findOne({ email });

    // Kiểm tra nếu tài khoản không tồn tại
    if (!user) {
      return res.status(400).json({ message: "Tài khoản chưa đăng ký!" });
    }

    // Kiểm tra trạng thái bị block
    if (user.isBlocked) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa" });
    }

    // Kiểm tra vai trò đăng nhập
    if (isAdminLogin) {
      // Yêu cầu vai trò admin
      if (user.role !== "admin") {
        return res.status(403).json({
          message: "Bạn không có quyền truy cập Admin hoặc không phải Admin.",
        });
      }
    } else {
      // Người dùng không phải admin không thể đăng nhập qua admin-login
      if (user.role === "admin") {
        return res.status(403).json({
          message: "Vui lòng truy cập trang đăng nhập Admin để đăng nhập.",
        });
      }
    }

    // Kiểm tra mật khẩu
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Tạo token đăng nhập và trả về thông tin người dùng
    generateToken(user._id, res);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." });
  }
};

export const checkUserStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token (middleware auth)
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa" });
    }

    res.status(200).json({ message: "Tài khoản hợp lệ" });
  } catch (error) {
    console.error("Error in checking user status:", error.message);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: "Tài khoản chưa đăng ký" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    // Add your logic for password reset here (e.g., sending a reset link)
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "trungnguyenhs3105@gmail.com",
        pass: "ugtu fnsp xbqa vdff",
      },
    });

    var mailOptions = {
      from: "trungnguyenhs3105@gmail.com",
      to: email,
      subject: "Gửi token để đặt lại mã",
      html: `
        <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Để thay đổi mật khẩu, vui lòng bấm vào nút dưới đây:</p>
        <a href="${FRONTEND_URL}/reset-password/${token}" 
           style="display:inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-align: center; text-decoration: none; border-radius: 5px;">
           Bấm vào để thay đổi mật khẩu
        </a>
        <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Tài khoản đã được xác thực" });
    }

    if (
      user.verificationCode !== verificationCode ||
      user.verificationCodeExpires < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "Mã xác thực không hợp lệ hoặc đã hết hạn" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Xác thực tài khoản thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPasswordFromForget = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await UserModel.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res.json({ status: true, message: "Updated password success" });
  } catch (err) {
    return res.json("Token ko hợp lệ");
  }
};
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // Kiểm tra nếu token hợp lệ
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userId = decoded.id;

    // Kiểm tra người dùng
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    // Xác thực: Trường nào bị để trống?
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ error: "Vui lòng điền tất cả các trường thông tin!" });
    }

    // Xác thực: Mật khẩu cũ có đúng không?
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ error: "Mật khẩu cũ không đúng!" });
    }

    // Mã hóa mật khẩu mới và cập nhật
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi trong quá trình resetPassword:", error);
    return res
      .status(500)
      .json({ error: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    }); // Ensure cookies are properly cleared
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id; // ID của user đăng nhập được lấy từ middleware authMiddleware

    // Xóa tài khoản khỏi database
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Xóa tất cả các đoạn chat liên quan đến user
    await messageModel.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    // Xóa cookie (logout)
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Tài khoản đã được xóa !!!" });
  } catch (error) {
    console.log("Error in deleteAccount controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const authUser = async (req, res) => {
  try {
    const userId = req.headers["id"] || req.headers["x-id"]; // Kiểm tra header
    console.log("Received user ID:", userId);
    // Lấy token từ header 'Authorization'
    const token = req.headers.authorization?.split(" ")[1]; // Lấy token sau "Bearer"

    if (!token) {
      return res.status(400).json({ message: "Token không tồn tại" });
    }

    // Giải mã token để lấy thông tin người dùng
    const decoded = jwt.verify(token, "lostnfound"); // Đảm bảo key "lostnfound" đúng với key đã sử dụng để mã hóa token
    const username = decoded.authClaims[0].name; // Giả sử tên người dùng lưu trong authClaims

    // Tìm người dùng theo tên người dùng (username), không phải theo _id
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json(user); // Trả về thông tin người dùng
  } catch (error) {
    console.error("Lỗi khi xác thực người dùng:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Cập nhật thông tin người dùng
export const updateUserInfo = async (req, res) => {
  try {
    const { username, firstname, lastname, email } = req.body;
    const userId = req.user._id;

    // Kiểm tra xem có ít nhất một trường cần cập nhật không
    if (!username && !firstname && !lastname && !email) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    // Kiểm tra định dạng email
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email không đúng định dạng" });
      }

      // Kiểm tra xem email đã được sử dụng bởi user khác chưa
      const existingEmailUser = await UserModel.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingEmailUser) {
        return res.status(400).json({ message: "Email này đã được sử dụng" });
      }
    }

    // Cập nhật thông tin user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { username, firstname, lastname, email },
      {
        new: true,
        runValidators: true,
        select: "username firstname lastname email",
      } // Chỉ trả về các trường cần thiết
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi cập nhật thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau" });
  }
};
