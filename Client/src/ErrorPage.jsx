const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-xl rounded-lg max-w-md mx-auto">
        <h1 className="text-5xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Trang bạn tìm không tồn tại.
        </p>
        <p className="text-md text-gray-500 mb-4">
          Có thể bạn đã nhập sai URL hoặc trang đã bị xóa.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Quay lại Trang Chủ
        </button>
      </div>
    </div>
  );
};
export default ErrorPage;
