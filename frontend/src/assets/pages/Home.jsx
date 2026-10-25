import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../src/components/ProductCard";

const categories = [
  { value: "", label: "All" },
  { value: "necklace-sets", label: "Neck Sets" },
  { value: "black-beads", label: "Black Beads" },
  { value: "chains", label: "Chains" },
  { value: "rings", label: "Rings" },
  { value: "bangles", label: "Bangles" },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const url = category
      ? `http://localhost:5000/api/products?category=${category}`
      : "http://localhost:5000/api/products";

    axios
      .get(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [category]);

  return (
    <div>
      <section className="hero">
        <h1>Beautiful Rolled Gold Jewellery</h1>
        <p>Neck sets, black beads, chains, rings and bangles</p>
      </section>

      <div className="container">
        <div className="filters">
          {categories.map((c) => (
            <button
              key={c.value}
              className={category === c.value ? "active" : ""}
              onClick={() => setCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;