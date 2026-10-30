import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../config";

const statuses = ["New", "Confirmed", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  const [orders, setOrders] = useState([]);

  const load = () =>
    axios
      .get(`${API}/api/orders`, auth)
      .then((r) => setOrders(r.data))
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

  const setStatus = async (id, status) => {
    await axios.put(`${API}/api/orders/${id}`, { status }, auth);
    load();
  };

  return (
    <div className="wrap" style={{ padding: "30px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 className="serif" style={{ fontSize: 34 }}>Orders ({orders.length})</h2>
        <Link to="/admin" className="outline-btn">Products</Link>
      </div>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((o) => (
        <div key={o._id} style={{ background: "#fff", borderRadius: 10, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <b>{o.customerName}</b>
            <span>{new Date(o.createdAt).toLocaleString()}</span>
          </div>
          <p>📞 {o.phone}</p>
          <p>📍 {o.address}</p>
          <ul style={{ margin: "8px 0 8px 18px" }}>
            {o.items.map((i, n) => (
              <li key={n}>{i.name} x {i.qty} = ₹{i.price * i.qty}</li>
            ))}
          </ul>
          <p><b>Total: ₹{o.total}</b></p>
          <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)} style={{ padding: 8, marginTop: 6 }}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;