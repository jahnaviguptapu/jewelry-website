import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      if (!res.data.isAdmin) {
        setMsg("Not an admin account");
        return;
      }
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="wrap" style={{ padding: "50px 24px", minHeight: "60vh" }}>
      <h2 className="serif" style={{ fontSize: 34, marginBottom: 16 }}>Admin Login</h2>
      <div className="admin-form">
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" onClick={login}>LOGIN</button>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}

export default AdminLogin;