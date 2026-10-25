import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { API } from "../config";
import { categories } from "../data/categories";

const icons = {
  "silver-neck-sets": "📿",
  "black-beads": "📿",
  "necklace-sets": "👑",
  earrings: "✨",
  chains: "⛓",
  rings: "💍",
  bangles: "⭕",
  bracelets: "🔗",
};

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <small>THE ART OF ADORNMENT</small>
          <h1>
            Elegance That
            <br />
            Shines Forever
          </h1>
          <p>Discover jewellery for your special moments.</p>
          <button className="btn" onClick={() => navigate("/shop")}>
            EXPLORE COLLECTION →
          </button>
        </div>
      </section>

      <div className="wrap">
        <div className="section-head">
          <small>FIND YOUR FAVOURITE</small>
          <h2>Shop by Collection</h2>
          <p style={{ fontSize: 14 }}>
            Little treasures for every style and every story.
          </p>
        </div>
        <div className="cats">
          {categories.map((c) => (
            <div
              key={c.value}
              className="cat"
              onClick={() => navigate(`/shop?category=${c.value}`)}
            >
              <div className="circle">
                {icons[c.value]}
                <img
                  src={`/images/cat-${c.value}.jpg`}
                  alt=""
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
              <p>{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="finds-bg">
        <div className="wrap finds">
          <div className="finds-top">
            <div>
              <small>HANDPICKED FOR YOU</small>
              <h2>
                <span>Our Lovely</span> Finds
              </h2>
              <p style={{ fontSize: 14 }}>
                Discover pieces you will want to wear on repeat.
              </p>
            </div>
            <button className="outline-btn" onClick={() => navigate("/shop")}>
              View all products →
            </button>
          </div>

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
      </section>
    </>
  );
}

export default Home;