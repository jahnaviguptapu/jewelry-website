import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { imgUrl } from "../components/ProductCard";
import { API } from "../config";
import BuyNow from "../components/BuyNow";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [buying, setBuying] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`${API}/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(console.log);
  }, [id]);

  if (!product) return <p className="empty">Loading...</p>;

  return (
    <div className="wrap" style={{ padding: "30px 24px", display: "flex", gap: 40, flexWrap: "wrap" }}>
      <div style={{ width: 380, maxWidth: "100%", height: 380, background: "#f3d9d6", borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>
        {product.image ? (
          <img src={imgUrl(product.image)} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : "💍"}
      </div>

      <div style={{ flex: 1, minWidth: 260 }}>
        <Link to="/shop" style={{ color: "#b85c68", fontSize: 14 }}>← Back to shop</Link>
        <h2 className="serif" style={{ fontSize: 34, marginTop: 10 }}>{product.name}</h2>
        <p style={{ margin: "6px 0", color: "#888" }}>{product.material}</p>
        <p className="price" style={{ fontSize: 24, margin: "10px 0" }}>
          ₹{product.price}
          {product.oldPrice > 0 && <s>₹{product.oldPrice}</s>}
        </p>
        <p style={{ lineHeight: 1.8, margin: "10px 0" }}>
          {product.description || "Beautiful jewellery from Strii Collections."}
        </p>
        <p style={{ margin: "10px 0" }}>
          {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"} 
        </p>
        <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
           <button className="btn" onClick={() => setBuying(true)}>BUY NOW</button>
           <button className="outline-btn" onClick={() => addToCart(product)}>ADD TO BAG</button>
        </div>
        {buying && <BuyNow product={product} onClose={() => setBuying(false)} />}
      </div>
    </div>
  );
}

export default ProductDetails;