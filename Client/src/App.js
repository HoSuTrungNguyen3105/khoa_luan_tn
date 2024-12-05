import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import Profile from "./pages/Profile/Profile.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./conpoments/Navbar/Navbar.jsx";
import Chat from "./pages/Chat/Chat.jsx";
import DeleteAccount from "./conpoments/ProfileCard/DeleteAccount.jsx";
import Login from "./conpoments/Admin/Login.jsx";
import Register from "./conpoments/Admin/Register.jsx";
import AdminDash from "./pages/home/AdminDash.jsx";
import PostDetail from "./conpoments/Post/PostDetail.jsx";
import AdminSidebar from "./pages/home/AdminSidebar.jsx";
import UserList from "./conpoments/Admin/UserList.jsx";
import ForgetPass from "./pages/Auth/ForgetPass.jsx";
import ResetPass from "./pages/Auth/ResetPass.jsx";
import SearchDetail from "./conpoments/Post/SearchDetail.jsx";
import SearchPage from "./conpoments/LogoSearch/SearchPage.jsx";
import RegisterUser from "./pages/Auth/RegisterUser.jsx";
import AdvControl from "./conpoments/Admin/AdvControl.jsx";
import AddAdv from "./conpoments/AdvCard/AddAdv.jsx";
import AdvList from "./conpoments/AdvCard/AdvList.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  console.log({ onlineUsers });
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/sign-in" />}
        />
        {/* Đăng nhập, chuyển hướng nếu đã đăng nhập */}
        <Route
          path="/admin-login"
          element={
            !authUser ? <Auth isAdminLogin={true} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/sign-in"
          element={
            !authUser ? <Auth isAdminLogin={false} /> : <Navigate to="/" />
          }
        />
        <Route path="/admin-dashboard" element={<AdminSidebar />}>
          {/* Trang Dashboard mặc định */}
          <Route path="admin-post" element={<AdminDash />} />{" "}
          <Route path="admin-user" element={<UserList />} />{" "}
          <Route path="admin-adv" element={<AdvControl />} />{" "}
          {/* Các route khác có thể thêm ở đây */}
        </Route>
        {/* Các route khác */}
        <Route path="/search" element={<div>Tìm kiếm</div>} />
        <Route path="*" element={<div>Lỗi</div>} />
        <Route path="/forget-password" element={<ForgetPass />} />{" "}
        <Route path="/reset-password/:token" element={<ResetPass />} />{" "}
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/sign-in" />}
        />
        <Route path="/search-results" element={<SearchPage />} />
        <Route
          path="/sign-up"
          element={!authUser ? <RegisterUser /> : <Navigate to="/" />}
        />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/chatbox" element={<Chat />} />
        <Route path="/advAdd" element={<AddAdv />} />
        <Route path="/advList" element={<AdvList />} />
        <Route path="/admin-register" element={<Register />} />
        <Route path="/post/:id" element={<PostDetail />} />{" "}
        {/* Trang chi tiết bài viết */}
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
