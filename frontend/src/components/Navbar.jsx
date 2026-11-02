import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { categories } from "../data/categories";

function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const isAdmin = !!localStorage.getItem("adminToken");

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const doSearch = (e) => {
    e.preventDefault();
    const t = term.trim();
    if (!t) return;
    navigate(`/shop?search=${encodeURIComponent(t)}`);
    setOpen(false);
  };

  const searchForm = (cls) => (
    <form className={cls} onSubmit={doSearch} onClick={(e) => e.stopPropagation()}>
      <input
        className="search"
        placeholder="Search jewellery..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </form>
  );

  return (
    <>
      <div className="topbar">✦ A LITTLE SPARKLE, A LOT OF LOVE ✦</div>
      <header className="navbar">
        <div className="wrap">
          <Link to="/" className="logo">
            STRII<small>COLLECTIONS</small>
          </Link>

          <nav className={`menu ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
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
            <NavLink to="/track">Track Order</NavLink>
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            {searchForm("mobile-search")}
            <button className="outline-btn mobile-logout" onClick={logout}>Logout</button>
          </nav>

          {searchForm("desktop-search")}

          <div className="icons">
            <Link to="/cart"><span>🛍<b>{count}</b></span></Link>
            <button className="outline-btn desktop-logout" onClick={logout}>Logout</button>
            <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;