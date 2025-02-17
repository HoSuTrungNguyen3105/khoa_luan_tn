import cloudinary from "../lib/cloudinary.js";
import Notification from "../Models/notificationModel.js";
import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import ContractModel from "../Models/contractModel.js";
import bcrypt from "bcryptjs";
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetail } = user._doc;
      res.status(200).json(otherDetail);
      res.status(200).json(user); // Trả về toàn bộ dữ liệu user, bao gồm cả mật khẩu
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a User by ID
export const getUserProfile = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params
  try {
    const user = await UserModel.findById(userId);

    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails); // Trả về thông tin người dùng (không bao gồm mật khẩu)
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
};
export const getUserById = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lấy danh sách bài đăng của người dùng
    const posts = await PostModel.find({ userId });

    // Loại bỏ mật khẩu trước khi trả về
    const { password, ...otherDetails } = user._doc;

    res.status(200).json({
      ...otherDetails,
      posts, // Thêm danh sách bài đăng của user vào response
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving user profile" });
  }
};
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json("User not found");
      }

      // Thực hiện xóa
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Forbidden: Access denied");
  }
};

export const followUser = async (req, res) => {
  const userId = req.params.id; // Lấy userId từ URL (người dùng được follow)
  const { _id } = req.body; // Lấy ID người theo dõi từ body (người follow)

  if (!userId || !_id) {
    return res.status(400).json({ message: "Missing user IDs" });
  }

  try {
    // Tìm người dùng được follow
    const followUser = await UserModel.findById(userId);
    // Tìm người dùng đang follow
    const followingUser = await UserModel.findById(_id);

    if (!followUser) {
      return res
        .status(404)
        .json({ message: "Người dùng không tìm thấy hoặc đã xóa tài khoản" });
    }

    if (!followingUser) {
      return res.status(404).json({ message: "Người theo dõi không tìm thấy" });
    }

    if (!followUser.followers.includes(_id)) {
      // Cập nhật danh sách followers và following
      await followUser.updateOne({ $push: { followers: _id } });
      await followingUser.updateOne({ $push: { following: userId } });

      // Tạo thông báo cho người được follow
      const notification = new Notification({
        userId: userId, // Người nhận thông báo
        senderId: _id, // Người gửi thông báo (người follow)
        message: `${followingUser.username} đã follow bạn`, // Nội dung thông báo
        type: "follow",
      });
      await notification.save();

      return res.status(200).json({
        message: "Follow successful and notification created",
        data: notification,
      });
    } else {
      // Nếu người dùng đã theo dõi
      return res.status(403).json({ message: "Bạn đã theo dõi người này rồi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params; // userId là ID của người dùng muốn lấy thông báo

    // Lấy tất cả thông báo cho người dùng
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // Sắp xếp thông báo mới nhất lên đầu
      .limit(10); // Giới hạn 10 thông báo gần nhất

    return res.status(200).json({
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error in fetching notifications" });
  }
};
// Controller bỏ theo dõi user
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (_id === id) {
    return res.status(403).json({ message: "Bạn ko thể unfollow chính mình" });
  }

  try {
    const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(_id);

    if (followUser.followers.includes(_id)) {
      await followUser.updateOne({ $pull: { followers: _id } });
      await followingUser.updateOne({ $pull: { following: id } });

      return res.status(200).json({ message: "Bỏ theo dõi thành công!" });
    } else {
      return res.status(403).json({ message: "Bạn chưa theo dõi người này!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to unfollow the user!" });
  }
};
// Kiểm tra trạng thái follow giữa hai người dùng
export const fetchFollowingStatus = async (req, res) => {
  const { currentUserId } = req.query; // Lấy currentUserId từ query
  const { targetUserId } = req.params; // Lấy targetUserId từ params

  try {
    // Kiểm tra nếu cả hai userId được truyền
    if (!currentUserId || !targetUserId) {
      return res.status(400).send({ message: "Missing parameters" });
    }

    // Tìm user được theo dõi
    const targetUser = await UserModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found." });
    }

    // Kiểm tra currentUserId có trong danh sách followers không
    const isFollowing = targetUser.followers.includes(currentUserId);

    return res.status(200).json({ isFollowing }); // Trả về trạng thái follow
  } catch (error) {
    console.error("Error fetching follow status:", error);
    return res
      .status(500)
      .json({ message: "Lỗi user đã xóa tài khoản hoặc không kết nối được." });
  }
};
export const searchUser = async (req, res) => {
  try {
    const query = req.query.q || "";
    const users = await UserModel.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { firstname: { $regex: query, $options: "i" } },
        { lastname: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tìm kiếm người dùng" });
  }
};
export const searchPost = async (req, res) => {
  try {
    const query = req.query.q || "";
    const posts = await PostModel.find({
      desc: { $regex: query, $options: "i" },
    }).populate("userId", "username profilePic");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tìm kiếm bài đăng" });
  }
};
export const rewardPoint = async (req, res) => {
  const { userId, points } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    user.points += points;
    await user.save();

    res.json({ message: "Cộng điểm thành công!", points: user.points });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const contract = async (req, res) => {
  // try {
  //   const { finderId, loserId, images } = req.body;
  //   // Kiểm tra xem finderId và loserId có hợp lệ không
  //   const finder = await UserModel.findById(finderId);
  //   const loser = await UserModel.findById(loserId);
  //   if (!finder || !loser) {
  //     return res.status(404).json({ message: "Người dùng không tồn tại." });
  //   }
  //   // Tạo hợp đồng mới
  //   const newContract = new {
  //     finder: finderId,
  //     loser: loserId,
  //     image: images || [],
  //     status: "pending",
  //   }();
  //   // Lưu hợp đồng vào database
  //   await newContract.save();
  //   res.status(201).json({
  //     status: "Success",
  //     message: "Hợp đồng đã được tạo.",
  //     data: newContract,
  //   });
  // } catch (error) {
  //   console.error("Lỗi khi tạo hợp đồng:", error);
  //   res.status(500).json({ message: "Lỗi khi tạo hợp đồng." });
  // }
};
export const addContract = async (req, res) => {
  try {
    const { finderId, loserId, postId, images } = req.body;

    if (!finderId || !loserId || !postId) {
      return res.status(400).json({ message: "Thiếu thông tin hợp đồng!" });
    }

    if (finderId === loserId) {
      return res
        .status(400)
        .json({ message: "Không thể tạo hợp đồng với chính mình!" });
    }

    // Kiểm tra người dùng và bài đăng tồn tại không
    const finder = await UserModel.findById(finderId);
    const loser = await UserModel.findById(loserId);
    const post = await PostModel.findById(postId);

    if (!finder || !loser || !post) {
      return res
        .status(404)
        .json({ message: "Người dùng hoặc bài đăng không tồn tại!" });
    }

    // Kiểm tra xem hợp đồng đã tồn tại chưa
    const existingContract = await ContractModel.findOne({ postId });

    if (existingContract) {
      return res
        .status(400)
        .json({ message: "Hợp đồng cho bài viết này đã tồn tại." });
    }

    // Tạo hợp đồng mới
    const newContract = new ContractModel({
      finder: { userId: finderId, images },
      loser: { userId: loserId },
      postId,
    });

    await newContract.save();

    res
      .status(201)
      .json({ message: "Hợp đồng đã được tạo!", contract: newContract });
  } catch (error) {
    console.error("Lỗi khi tạo hợp đồng:", error);
    res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại!" });
  }
};
const levelMapping = {
  1: "Thành viên mới",
  2: "Thành viên đồng",
  3: "Thành viên bạc",
  4: "Thành viên vàng",
  5: "Thành viên kim cương",
};

// Hàm chuyển đổi level số sang text
const getLevelText = (level) => {
  return levelMapping[level] || "Thành viên đặc biệt";
};

export const updateUserLevel = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tính toán level dựa trên năm đăng ký
    const currentYear = new Date().getFullYear();
    const registrationYear = user.createdAt.getFullYear();
    const yearsRegistered = currentYear - registrationYear;

    // Gán level mới
    const newLevel = yearsRegistered > 5 ? 5 : yearsRegistered; // Giới hạn max là 5

    // Cập nhật danh hiệu (badges)
    let newBadges = [...user.badges];
    if (!newBadges.includes(newLevel)) {
      newBadges.push(newLevel);
    }

    if (user.level !== newLevel) {
      user.level = newLevel;
      user.badges = newBadges;
      await user.save();
    }

    return res.status(200).json({
      level: user.level,
      levelText: getLevelText(user.level),
      badges: user.badges.map(getLevelText),
    });
  } catch (error) {
    console.error("Lỗi cập nhật cấp độ:", error);
    return res.status(500).json({ message: "Lỗi cập nhật cấp độ" });
  }
};

export const acceptContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    if (!["pending", "confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    // Cập nhật trạng thái hợp đồng
    const contract = await ContractModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contract) {
      return res.status(404).json({ message: "Hợp đồng không tồn tại." });
    }

    return res.status(200).json({
      message: "Cập nhật trạng thái thành công.",
      contract,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};
export const fetchContract = async (req, res) => {
  try {
    const contracts = await ContractModel.find()
      .populate("finder.userId", "username") // Lấy thông tin người tìm
      .populate("loser.userId", "username") // Lấy thông tin người bị mất
      .populate("postId", "desc"); // Lấy thông tin bài đăng

    res.status(200).json(contracts);
  } catch (error) {
    console.error("Lỗi lấy danh sách hợp đồng:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;

  // Kiểm tra xem mật khẩu cũ và mới đã được nhập đầy đủ chưa
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  // Kiểm tra độ dài của mật khẩu mới
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
  }

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    }

    // Băm mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới
    user.password = hashedPassword;
    await user.save();

    // Trả về thông báo thành công
    res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi thay đổi mật khẩu" });
  }
};
