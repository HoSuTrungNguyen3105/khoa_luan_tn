import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";

const SendEmail = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [userEmails, setUserEmails] = useState([]);

  // Gọi API lấy danh sách email của user
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axiosInstance.get("/auth/get-emails");
        setUserEmails(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách email:", error);
      }
    };

    fetchEmails();
  }, []);

  // Xử lý khi nhập email thủ công
  const handleInputChange = (e) => {
    setInputEmail(e.target.value);
  };
  const handleSelectAllEmails = () => {
    setInputEmail(userEmails.join(", "));
  };

  // Xử lý xóa email khi bấm vào dấu X
  const handleRemoveEmail = (emailToRemove) => {
    const updatedEmails = inputEmail
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== emailToRemove);

    setInputEmail(updatedEmails.join(", "));
  };

  // Xử lý chọn email từ danh sách user
  const handleSelectEmail = (email) => {
    const currentEmails = inputEmail
      ? inputEmail.split(",").map((email) => email.trim())
      : [];

    if (!currentEmails.includes(email)) {
      currentEmails.push(email);
      setInputEmail(currentEmails.join(", "));
    }
  };

  // Xử lý gửi email
  const handleSendEmail = async () => {
    const emails = inputEmail
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    if (emails.length === 0 || !subject || !message) {
      setStatus("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/send-email", {
        emails,
        subject,
        message,
      });

      setStatus(response.data.success);
    } catch (error) {
      setStatus("Lỗi khi gửi email.");
      console.error("Lỗi:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Gửi Email</h2>

      {/* Ô nhập email với nút xóa từng email */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Nhập email (cách nhau bằng dấu phẩy)"
          value={inputEmail}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Hiển thị email đã nhập dạng badge có nút xóa */}
        <div className="flex flex-wrap gap-2 mt-2">
          {inputEmail
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email !== "")
            .map((email, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                {email}
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Tiêu đề */}
      <input
        type="text"
        placeholder="Tiêu đề"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Nội dung email */}
      <textarea
        rows="5"
        placeholder="Nội dung email"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSelectAllEmails}
        className=" bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 mb-2"
      >
        Chọn tất cả email
      </button>
      {/* Nút gửi */}
      <button
        onClick={handleSendEmail}
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
      >
        Gửi Email
      </button>

      {/* Trạng thái */}
      {status && <p className="mt-2 text-center text-red-500">{status}</p>}

      {/* Danh sách email của user */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Chọn từ danh sách:</h3>
        <div className="grid grid-cols-2 gap-2">
          {userEmails.map((email, index) => (
            <button
              key={index}
              onClick={() => handleSelectEmail(email)}
              className="p-2 border rounded-md bg-gray-100 hover:bg-gray-200"
            >
              {email}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
