import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

function Login() {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const switchMode = (m) => {
    setMode(m);
    setMsg("");
  };

  const submit = async () => {
    setMsg("");
    if (mode === "register" && !form.name.trim()) {
      setMsg("Please enter your name.");
      return;
    }
    if (!form.email.trim() || !form.password) {
      setMsg("Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      const url = mode === "register" ? "register" : "login";
      const res = await axios.post(`${API}/api/auth/${url}`, form);
      localStorage.removeItem("userToken");
      localStorage.removeItem("adminToken");
      localStorage.setItem(res.data.isAdmin ? "adminToken" : "userToken", res.data.token);
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="logo" style={{ textAlign: "center", marginBottom: 18 }}>
          STRII<small>COLLECTIONS</small>
        </div>

        <div className="auth-tabs">
          <button className={mode === "login" ? "on" : ""} onClick={() => switchMode("login")}>
            Log in
          </button>
          <button className={mode === "register" ? "on" : ""} onClick={() => switchMode("register")}>
            Create account
          </button>
        </div>

        <p style={{ textAlign: "center", margin: "12px 0 16px", fontSize: 14 }}>
          {mode === "login"
            ? "Welcome back! Log in to view our collection."
            : "Create a free account to view our collection."}
        </p>

        <div className="admin-form" style={{ padding: 0 }}>
          {mode === "register" && (
            <input name="name" placeholder="Your name" value={form.name} onChange={change} />
          )}
          <input name="email" placeholder="Email" value={form.email} onChange={change} />
          <input
            name="password"
            type="password"
            placeholder={mode === "register" ? "Create a password (6+ characters)" : "Password"}
            value={form.password}
            onChange={change}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <button className="btn" onClick={submit} disabled={busy}>
            {busy ? "PLEASE WAIT…" : mode === "login" ? "LOG IN" : "CREATE ACCOUNT"}
          </button>
          {msg && <p style={{ color: "#b3261e" }}>{msg}</p>}
        </div>

        <p style={{ textAlign: "center", marginTop: 14, fontSize: 13 }}>
          {mode === "login" ? "New here? " : "Already have an account? "}
          <a
            href="#"
            style={{ color: "#b85c68" }}
            onClick={(e) => {
              e.preventDefault();
              switchMode(mode === "login" ? "register" : "login");
            }}
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;