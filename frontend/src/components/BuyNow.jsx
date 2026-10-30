import { useState } from "react";
import axios from "axios";
import { API } from "../config";

function BuyNow({ product, onClose }) {
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", qty: 1 });
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.customerName.trim() || !form.phone.trim() || !form.address.trim()) {
      setMsg("Name, phone and address anni kavali");
      return;
    }
    setBusy(true);
    try {
      await axios.post(`${API}/api/orders`, {
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        items: [{ productId: product._id, qty: Number(form.qty) || 1 }],
      });
      setDone(true);
    } catch (err) {
      setMsg(err.response?.data?.message || "Order failed. Malli try chey.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <>
            <h3 className="serif" style={{ fontSize: 26 }}>Thank you! 💍</h3>
            <p style={{ margin: "12px 0" }}>
              Mee order vachindi. Memu tvaraga phone lo contact chestam.
            </p>
            <button className="btn" onClick={onClose}>CLOSE</button>
          </>
        ) : (
          <>
            <h3 className="serif" style={{ fontSize: 24 }}>Buy now</h3>
            <p style={{ margin: "6px 0" }}>
              {product.name} · ₹{product.price}
            </p>
            <div className="admin-form" style={{ padding: 0 }}>
              <input name="customerName" placeholder="Your name" value={form.customerName} onChange={change} />
              <input name="phone" placeholder="Phone number" value={form.phone} onChange={change} />
              <textarea name="address" rows="3" placeholder="Full address" value={form.address} onChange={change} />
              <input name="qty" type="number" min="1" value={form.qty} onChange={change} />
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn" onClick={submit} disabled={busy}>
                  {busy ? "PLACING…" : "PLACE ORDER"}
                </button>
                <button className="outline-btn" onClick={onClose}>Cancel</button>
              </div>
              {msg && <p style={{ color: "#b3261e" }}>{msg}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BuyNow;