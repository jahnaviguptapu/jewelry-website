import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { imgUrl } from "../components/ProductCard";
import { API } from "../config";

function Cart() {
  const { cart, removeFromCart, changeQty, clearCart, total } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Name, phone and address anni kavali");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await axios.post(`${API}/api/orders`, {
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        items: cart.map((i) => ({ productId: i._id, qty: i.qty })),
      });
      clearCart();
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Order failed. Malli try chey.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="wrap" style={{ padding: "40px 24px", minHeight: "50vh" }}>
        <h2 className="serif" style={{ fontSize: 34 }}>Thank you! 💍</h2>
        <p style={{ margin: "16px 0" }}>
          Mee order vachindi. Memu tvaraga contact chestam.
        </p>
        <Link to="/shop" className="btn" style={{ display: "inline-block" }}>
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="wrap" style={{ padding: "40px 24px", minHeight: "50vh" }}>
        <h2 className="serif" style={{ fontSize: 34 }}>Your Bag</h2>
        <p style={{ margin: "16px 0" }}>Your bag is empty.</p>
        <Link to="/shop" className="btn" style={{ display: "inline-block" }}>
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: "30px 24px", minHeight: "50vh" }}>
      <h2 className="serif" style={{ fontSize: 34, marginBottom: 16 }}>Your Bag</h2>

      {cart.map((i) => (
        <div
          key={i._id}
          style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12, background: "#fff", padding: 12, borderRadius: 8, flexWrap: "wrap" }}
        >
          <div style={{ width: 80, height: 80, background: "#f3d9d6", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {i.image ? (
              <img src={imgUrl(i.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : "💍"}
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <p>{i.name}</p>
            <p className="price">₹{i.price}</p>
          </div>
          <div>
            <button onClick={() => changeQty(i._id, i.qty - 1)}>−</button>
            <span style={{ margin: "0 10px" }}>{i.qty}</span>
            <button onClick={() => changeQty(i._id, i.qty + 1)}>+</button>
          </div>
          <p style={{ width: 80, textAlign: "right" }}>₹{i.price * i.qty}</p>
          <button className="outline-btn" onClick={() => removeFromCart(i._id)}>Remove</button>
        </div>
      ))}

      <h3 style={{ textAlign: "right", margin: "16px 0" }}>Total: ₹{total}</h3>

      <div className="admin-form" style={{ marginTop: 10 }}>
        <h3 className="serif" style={{ fontSize: 24 }}>Delivery details</h3>
        <input name="name" placeholder="Your name" value={form.name} onChange={change} />
        <input name="phone" placeholder="Phone number" value={form.phone} onChange={change} />
        <textarea name="address" rows="3" placeholder="Full address" value={form.address} onChange={change} />
        <button className="btn" onClick={placeOrder} disabled={busy}>
          {busy ? "PLACING…" : "PLACE ORDER"}
        </button>
        {error && <p style={{ color: "#b3261e" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Cart;