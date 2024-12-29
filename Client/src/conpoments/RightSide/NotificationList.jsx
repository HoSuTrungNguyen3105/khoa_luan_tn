// NotificationList.js
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

const NotificationList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(
          `/user/notifications/${userId}`
        );
        setNotifications(response.data.data);
      } catch (error) {
        setError("Lỗi khi tải thông báo");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (notifications.length === 0) return <div>Không có thông báo</div>;

  return (
    <div className="notification-list">
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} className="notification-item">
            <small>{new Date(notification.createdAt).toLocaleString()}</small>
            <p>{notification.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
