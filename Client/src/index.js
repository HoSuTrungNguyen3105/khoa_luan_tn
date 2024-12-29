import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Thêm BrowserRouter
import App from "./App.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Environment } from "./PrivateRoute.js";

const container = document.getElementById("root");
const root = createRoot(container); // Tạo root từ phần tử DOM
const clientID = Environment.GG_CLIENT_ID;

root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={clientID}>
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
);
