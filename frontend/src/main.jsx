import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";

axios.interceptors.request.use((config) => {
  const t = localStorage.getItem("adminToken") || localStorage.getItem("userToken");
  if (t && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

axios.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = err.config?.url || "";
    if (
      err.response?.status === 401 &&
      !url.includes("/api/auth/login") &&
      !window.location.pathname.startsWith("/admin")
    ) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);