import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/categories";
import { API } from "../config";

function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const sub = params.get("sub") || "";
  const [products, setProducts] = useState([]);

  const current = categories.find((c) => c.value === category);

  useEffect(() => {
    const q = new URLSearchParams();
    if (category) q.set("category", category);
    if (sub) q.set("sub", sub);
    axios
      .get(`${API}/api/products?${q.toString()}`)
      .then((res) => setProducts(res.data))
      .catch(console.log);
  }, [category, sub]);

  const pill = (active) =>
    active ? { background: "#b85c68", color: "#fff" } : {};

  return (
    <div className="wrap" style={{ padding: "30px 24px" }}>
      <h2 className="serif" style={{ fontSize: 34, marginBottom: 16 }}>Shop</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <button className="outline-btn" style={pill(!category)} onClick={() => setParams({})}>
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.value}
            className="outline-btn"
            style={pill(category === c.value)}
            onClick={() => setParams({ category: c.value })}
          >
            {c.label}
          </button>
        ))}
      </div>

      {current && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          <button
            className="outline-btn"
            style={{ padding: "7px 16px", fontSize: 13, ...pill(!sub) }}
            onClick={() => setParams({ category })}
          >
            All {current.label}
          </button>
          {current.subs.map((s) => (
            <button
              key={s.value}
              className="outline-btn"
              style={{ padding: "7px 16px", fontSize: 13, ...pill(sub === s.value) }}
              onClick={() => setParams({ category, sub: s.value })}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="empty">No products found.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Shop;