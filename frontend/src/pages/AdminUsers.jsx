import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../config";

function AdminUsers() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const load = () =>
    axios
      .get(`${API}/api/auth/users`, auth)
      .then((r) => setUsers(r.data))
      .catch(() => {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      });

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    load();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const create = async () => {
    try {
      await axios.post(`${API}/api/auth/users`, form, auth);
      setMsg(`Created. Share with the customer: ${form.email} / ${form.password}`);
      setForm({ name: "", email: "", password: "" });
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this account?")) return;
    await axios.delete(`${API}/api/auth/users/${id}`, auth);
    load();
  };

  return (
    <div className="wrap" style={{ padding: "30px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 className="serif" style={{ fontSize: 34 }}>Customers ({users.length})</h2>
        <Link to="/admin" className="outline-btn">Products</Link>
      </div>

      <div className="admin-form">
        <h3 className="serif" style={{ fontSize: 22 }}>Create customer account</h3>
        <input name="name" placeholder="Name" value={form.name} onChange={change} />
        <input name="email" placeholder="Email" value={form.email} onChange={change} />
        <input name="password" placeholder="Password (6+ characters)" value={form.password} onChange={change} />
        <button className="btn" onClick={create}>CREATE</button>
        {msg && <p>{msg}</p>}
      </div>

      <h3 className="serif" style={{ fontSize: 24, margin: "26px 0 10px" }}>Accounts</h3>
      {users.map((u) => (
        <div key={u._id} className="admin-row">
          <span style={{ flex: 1 }}>{u.name}</span>
          <span>{u.email}</span>
          <button className="outline-btn" onClick={() => remove(u._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminUsers;