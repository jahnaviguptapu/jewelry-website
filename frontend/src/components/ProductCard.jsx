import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API } from "../config";

const names = {
  "silver-neck-sets": "Silver Neck Sets",
  "black-beads": "Black Beads",
  "necklace-sets": "Neck Sets",
  earrings: "Earrings",
  chains: "Chains",
  rings: "Rings",
  bangles: "Bangles",
  bracelets: "Bracelets",
};

export const imgUrl = (image) =>
  image && image.startsWith("/uploads") ? `${API}${image}` : image;

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <Link to={`/product/${product._id}`}>
        <div className="card-img">
          {product.image ? (
            <img src={imgUrl(product.image)} alt={product.name} />
          ) : (
            "💍"
          )}
          {product.badge && <span className="badge">{product.badge}</span>}
          <span className="heart">♡</span>
        </div>
      </Link>
      <div className="card-body">
        <p className="cat-name">{names[product.category]}</p>
        <Link to={`/product/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="price">
          ₹{product.price}
          {product.oldPrice > 0 && <s>₹{product.oldPrice}</s>}
        </p>
        <button className="add" onClick={() => addToCart(product)}>
          ADD TO BAG
        </button>
      </div>
    </div>
  );
}

export default ProductCard;