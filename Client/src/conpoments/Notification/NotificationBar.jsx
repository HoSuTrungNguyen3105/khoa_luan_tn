import React from "react";
import { Bell } from "lucide-react"; // Icon chuông
import { useNotificationStore } from "../../store/useNotificationStore";

const NotificationBar = () => {
  const { notifications } = useNotificationStore();

  return (
    <div className="relative">
      <button className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-300">
        <Bell size={24} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-2 z-50">
          <h3 className="font-semibold text-gray-800 mb-2">Thông báo</h3>
          <ul className="max-h-60 overflow-auto">
            {notifications.map((notif) => (
              <li key={notif.id} className="p-2 border-b last:border-0 text-sm">
                {notif.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
