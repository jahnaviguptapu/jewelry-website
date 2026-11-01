import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import TrackOrder from "./pages/TrackOrder";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";

const isLoggedIn = () =>
  !!(localStorage.getItem("userToken") || localStorage.getItem("adminToken"));

function Guard({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function App() {
  const { pathname } = useLocation();
  const bare = pathname === "/login" || pathname === "/admin-login";
  const showFrame = !bare && isLoggedIn();

  return (
    <>
      {showFrame && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/" element={<Guard><Home /></Guard>} />
        <Route path="/shop" element={<Guard><Shop /></Guard>} />
        <Route path="/our-story" element={<Guard><OurStory /></Guard>} />
        <Route path="/contact" element={<Guard><Contact /></Guard>} />
        <Route path="/cart" element={<Guard><Cart /></Guard>} />
        <Route path="/product/:id" element={<Guard><ProductDetails /></Guard>} />
        <Route path="/track" element={<Guard><TrackOrder /></Guard>} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
        <Route path="/admin-users" element={<AdminUsers />} />
      </Routes>
      {showFrame && <Footer />}
    </>
  );
}

export default App;