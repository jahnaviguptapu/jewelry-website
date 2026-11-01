import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      localStorage.removeItem("userToken");
      localStorage.removeItem("adminToken");
      localStorage.setItem(res.data.isAdmin ? "adminToken" : "userToken", res.data.token);
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="logo" style={{ textAlign: "center", marginBottom: 18 }}>
          STRII<small>COLLECTIONS</small>
        </div>
        <h2 className="serif" style={{ fontSize: 28, textAlign: "center" }}>Welcome</h2>
        <p style={{ textAlign: "center", margin: "6px 0 16px", fontSize: 14 }}>
          Please log in to view our collection.
        </p>
        <div className="admin-form" style={{ padding: 0 }}>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <button className="btn" onClick={login}>LOGIN</button>
          {msg && <p style={{ color: "#b3261e" }}>{msg}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;