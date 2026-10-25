import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { imgUrl } from "../components/ProductCard";

function Cart() {
  const { cart, removeFromCart, changeQty, total } = useCart();

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
          style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14, background: "#fff", padding: 12, borderRadius: 8 }}
        >
          <div style={{ width: 80, height: 80, background: "#f3d9d6", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {i.image ? <img src={imgUrl(i.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "💍"}
          </div>
          <div style={{ flex: 1 }}>
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

      <h3 style={{ textAlign: "right", margin: "20px 0" }}>Total: ₹{total}</h3>
    </div>
  );
}

export default Cart;