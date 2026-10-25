import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { categories } from "../data/categories";

function Navbar() {
  const { count } = useCart();

  return (
    <>
      <div className="topbar">✦ A LITTLE SPARKLE, A LOT OF LOVE ✦</div>
      <header className="navbar">
        <div className="wrap">
          <Link to="/" className="logo">
            STRII<small>COLLECTIONS</small>
          </Link>

          <nav className="menu">
            <NavLink to="/" end>Home</NavLink>

            <div className="dropdown">
              <span className="dropdown-title">Collections ⌄</span>
              <div className="dropdown-menu">
                {categories.map((c) => (
                  <div key={c.value} className="dd-item">
                    <Link to={`/shop?category=${c.value}`}>
                      {c.label} <span className="dd-arrow">›</span>
                    </Link>
                    <div className="sub-menu">
                      {c.subs.map((s) => (
                        <Link
                          key={s.value}
                          to={`/shop?category=${c.value}&sub=${s.value}`}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/our-story">Our Story</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          <input className="search" placeholder="Search jewellery..." />

          <div className="icons">
            <span>♡<b>0</b></span>
            <Link to="/cart"><span>🛍<b>{count}</b></span></Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;