import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import SidebarSkeleton from "../Skeletons/SidebarSkeleton";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

const Sidebar = () => {
  const {
    getContacts,
    contacts,
    isLoading: isContactsLoading,
    selectedUser,
    setSelectedUser,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Lấy danh sách contacts từ server
  useEffect(() => {
    getContacts();
  }, [getContacts]);

  // Lọc users dựa trên trạng thái online/offline
  const filteredContacts = showOnlineOnly
    ? contacts.filter((contact) => onlineUsers.includes(contact._id))
    : contacts;

  // Hiển thị skeleton khi đang tải dữ liệu
  if (isContactsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Tùy chọn lọc online */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({Math.max(onlineUsers.length - 1, 0)} online)
          </span>
        </div>
      </div>

      {/* Danh sách contacts */}
      <div className="overflow-y-auto w-full py-3">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <button
              key={contact._id}
              onClick={() => setSelectedUser(contact)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${
                  selectedUser?._id === contact._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              {/* Avatar người dùng */}
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={contact.profilePic || "/avatar.jpg"}
                  alt={contact.username}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(contact._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* Thông tin người dùng */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{contact.username}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(contact._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-gray-500">No contacts yet.</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
