import { useState } from "react";
import axios from "axios";
import { API } from "../config";

function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState(null);
  const [msg, setMsg] = useState("");

  const search = async () => {
    setMsg("");
    try {
      const res = await axios.get(`${API}/api/orders/track`, {
        params: { phone: phone.trim() },
      });
      setOrders(res.data);
    } catch (err) {
      setOrders(null);
      setMsg(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="wrap" style={{ padding: "40px 24px", minHeight: "55vh" }}>
      <h2 className="serif" style={{ fontSize: 34, marginBottom: 6 }}>Track your order</h2>
      <p style={{ marginBottom: 16 }}>Enter the phone number you used while ordering.</p>
      <div className="admin-form">
        <input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button className="btn" onClick={search}>TRACK</button>
        {msg && <p style={{ color: "#b3261e" }}>{msg}</p>}
      </div>

      {orders && orders.length === 0 && (
        <p style={{ marginTop: 16 }}>No orders found for this number.</p>
      )}

      {orders &&
        orders.map((o) => (
          <div key={o.id} style={{ background: "#fff", borderRadius: 10, padding: 16, marginTop: 12, maxWidth: 460 }}>
            <p><b>Status: {o.status}</b></p>
            <p style={{ fontSize: 13, color: "#777" }}>{new Date(o.createdAt).toLocaleString()}</p>
            <ul style={{ margin: "8px 0 8px 18px" }}>
              {o.items.map((i, n) => (
                <li key={n}>{i.name} x {i.qty}</li>
              ))}
            </ul>
            <p>Total: ₹{o.total}</p>
          </div>
        ))}
    </div>
  );
}

export default TrackOrder;