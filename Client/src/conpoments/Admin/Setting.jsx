import React, { useState, useEffect } from "react";
import "./Report.css"; // Thêm nếu cần style
import { axiosInstance } from "../../lib/axios";

// Component for checking password strength
const checkPasswordStrength = (password) => {
  if (password.length < 8) {
    return "Mật khẩu phải có ít nhất 8 ký tự.";
  }
  return "";
};

const Setting = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordHelp, setPasswordHelp] = useState("");
  const [language, setLanguage] = useState("Tiếng Việt");
  const [theme, setTheme] = useState("Giao diện sáng");
  const [dataSharing, setDataSharing] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Lấy thông báo từ backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get("/admin/notifications");
        setReports(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      }
    };

    fetchReports();
  }, []); // Chạy 1 lần khi component được mount

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordHelp(checkPasswordStrength(e.target.value));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Sidebar for settings categories */}
        <div className="col-md-3">
          <ul className="list-group">
            <h1>Cài đặt</h1>
            <li className="list-group-item active">
              <i className="fas fa-user"></i> Tài khoản
            </li>
            <li className="list-group-item">Thông báo</li>
            <li className="list-group-item">Bảo mật</li>
            <li className="list-group-item">Ngôn ngữ</li>
            <li className="list-group-item">Giao diện</li>
            <li className="list-group-item">Quyền riêng tư</li>
          </ul>
        </div>

        {/* Main content for each setting category */}
        <div className="col-md-9">
          {/* Account Settings */}
          <h5>Tài khoản</h5>
          <form>
            <div className="form-group">
              <label htmlFor="username">Tên tài khoản</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value="User123"
                disabled
              />
            </div>

            <button type="submit" className="btn btn-primary mt-2">
              Cập nhật thông tin
            </button>
          </form>

          {/* Notification Settings */}
          <h5 className="mt-5">Thông báo</h5>
          {/* Hiển thị thông báo báo cáo nếu có */}
          {showNotifications && (
            <>
              <h5 className="mt-5">Thông báo báo cáo</h5>
              {loading ? (
                <p>Đang tải thông báo...</p>
              ) : error ? (
                <p className="text-danger">{error}</p>
              ) : reports.length === 0 ? (
                <p>Không có thông báo báo cáo.</p>
              ) : (
                <ul>
                  {reports.map((report, index) => (
                    <li key={index}>
                      <strong>{report.reportedBy}</strong> đã báo cáo bài viết
                      vào{" "}
                      <strong>
                        {new Date(report.reportedAt).toLocaleString()}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* Security Settings */}
          <h5 className="mt-5">Bảo mật</h5>
          <form>
            <div className="form-group">
              <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
              />
              <small id="passwordHelp" className="form-text text-muted">
                {passwordHelp}
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Cập nhật mật khẩu
            </button>
          </form>

          {/* Language Settings */}
          <h5 className="mt-5">Ngôn ngữ</h5>
          <div className="form-group">
            <label htmlFor="languageSelect">Chọn ngôn ngữ</label>
            <select
              className="form-control"
              id="languageSelect"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>Tiếng Việt</option>
              <option>English</option>
              <option>中文</option>
            </select>
          </div>

          {/* Interface Settings */}
          <h5 className="mt-5">Giao diện</h5>
          <div className="form-group">
            <label htmlFor="themeSelect">Chọn giao diện</label>
            <select
              className="form-control"
              id="themeSelect"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option>Giao diện sáng</option>
              <option>Giao diện tối</option>
            </select>
          </div>

          {/* Privacy Settings */}
          <h5 className="mt-5">Quyền riêng tư</h5>
          <form>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="dataSharing"
                checked={dataSharing}
                onChange={() => setDataSharing(!dataSharing)}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-2">
              Lưu cài đặt quyền riêng tư
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setting;
