import { useChatStore } from "../../store/useChatStore";
import Sidebar from "../../conpoments/ChatBox/Sidebar";
import NoChatSelected from "../../conpoments/ChatBox/NoChatSelected";
import ChatContainer from "../../conpoments/ChatBox/ChatContainer";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Chat = () => {
  const { selectedUser } = useChatStore(); // Giả sử useChatStore có action setSelectedUser
  const location = useLocation(); // Lấy location để truy cập dữ liệu đã được truyền qua
  const navigate = useNavigate();

  // Dữ liệu từ location.state mà bạn đã truyền qua
  const { message, sender, userId } = location.state || {};

  // Khi vào trang chatbox, bạn có thể lưu thông tin người gửi
  useEffect(() => {
    if (userId && sender) {
      selectedUser({ sender, userId, initialMessage: message });
    }
  }, [userId, sender, message, selectedUser]);

  const handleReturn = () => {
    navigate("/"); // Điều hướng về trang chủ
  };
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="p-4 flex items-center bg-base-300">
          <button onClick={handleReturn} className="btn btn-secondary">
            Return to Home
          </button>
        </div>
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
