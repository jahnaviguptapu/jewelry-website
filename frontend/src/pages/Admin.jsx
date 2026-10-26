import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";
import { imgUrl } from "../components/ProductCard";
import { API } from "../config";

const emptyForm = {
  name: "",
  price: "",
  oldPrice: "",
  badge: "",
  description: "",
  category: "rings",
  subCategory: "",
  material: "Rolled Gold",
  stock: 1,
  image: "",
};

function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

  const load = () =>
    axios.get(`${API}/api/products`).then((r) => setProducts(r.data));

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    load();
  }, [token, navigate]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("adminToken");
      navigate("/admin-login");
      return true;
    }
    return false;
  };

  const subs = categories.find((c) => c.value === form.category)?.subs || [];

  const change = (e) => {
    const { name, value } = e.target;
    if (name === "category") setForm({ ...form, category: value, subCategory: "" });
    else setForm({ ...form, [name]: value });
  };

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await axios.post(`${API}/api/upload`, data, auth);
      setForm((f) => ({ ...f, image: res.data.url }));
      setMsg("Photo uploaded ✅");
    } catch (err) {
      if (handleAuthError(err)) return;
      setMsg("Photo upload failed. Backend run avutundo check chey.");
    }
  };

  const save = async () => {
    if (!form.name || !form.price) {
      setMsg("Name and price kavali");
      return;
    }
    const body = {
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice) || 0,
      stock: Number(form.stock) || 0,
    };
    try {
      if (editId) {
        await axios.put(`${API}/api/products/${editId}`, body, auth);
        setMsg("Product updated ✅");
      } else {
        await axios.post(`${API}/api/products`, body, auth);
        setMsg("Product added ✅");
      }
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch (err) {
      if (handleAuthError(err)) return;
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const edit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice || "",
      badge: p.badge || "",
      description: p.description || "",
      category: p.category,
      subCategory: p.subCategory || "",
      material: p.material || "Rolled Gold",
      stock: p.stock,
      image: p.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/api/products/${id}`, auth);
      load();
    } catch (err) {
      if (handleAuthError(err)) return;
      setMsg("Delete failed");
    }
  };

  return (
    <div className="wrap" style={{ padding: "30px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 className="serif" style={{ fontSize: 34 }}>Admin Panel</h2>
        <button className="outline-btn" onClick={logout}>Logout</button>
      </div>

      <div className="admin-form">
        <h3 className="serif" style={{ fontSize: 24 }}>
          {editId ? "Edit product" : "Add new product"}
        </h3>
        <input name="name" placeholder="Product name" value={form.name} onChange={change} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={change} />
        <input name="oldPrice" type="number" placeholder="Old price (optional)" value={form.oldPrice} onChange={change} />
        <input name="badge" placeholder="Badge (NEW, SPECIAL...)" value={form.badge} onChange={change} />
        <textarea name="description" rows="3" placeholder="Description" value={form.description} onChange={change} />

        <select name="category" value={form.category} onChange={change}>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select name="subCategory" value={form.subCategory} onChange={change}>
          <option value="">No sub category</option>
          {subs.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select name="material" value={form.material} onChange={change}>
          <option>Rolled Gold</option>
          <option>Silver Polish</option>
        </select>

        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={change} />

        <label>Product photo</label>
        <input type="file" accept="image/*" onChange={upload} />
        {form.image && (
          <img src={imgUrl(form.image)} alt="" width="130" style={{ borderRadius: 8 }} />
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" onClick={save}>
            {editId ? "UPDATE PRODUCT" : "ADD PRODUCT"}
          </button>
          {editId && (
            <button className="outline-btn" onClick={cancel}>Cancel</button>
          )}
        </div>
        {msg && <p>{msg}</p>}
      </div>

      <h3 className="serif" style={{ fontSize: 26, margin: "30px 0 10px" }}>
        Products ({products.length})
      </h3>
      {products.map((p) => (
        <div key={p._id} className="admin-row">
          <div className="admin-thumb">
            {p.image ? <img src={imgUrl(p.image)} alt="" /> : "💍"}
          </div>
          <span style={{ flex: 1 }}>{p.name}</span>
          <span>₹{p.price}</span>
          <button className="outline-btn" onClick={() => edit(p)}>Edit</button>
          <button className="outline-btn" onClick={() => remove(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Admin;