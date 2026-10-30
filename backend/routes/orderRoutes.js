const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const adminOnly = require("../middleware/auth");

const router = express.Router();

// Customer order pettadam (login avasaram ledu)
// Price server lo product nundi teesukuntundi (customer marchalenu)
router.post("/", async (req, res) => {
  try {
    const { customerName, phone, address, items } = req.body;
    if (!customerName || !phone || !address || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Missing details" });
    }

    const orderItems = [];
    let total = 0;
    for (const it of items) {
      const p = await Product.findById(it.productId);
      if (!p) return res.status(400).json({ message: "Product not found" });
      const qty = Math.max(1, Number(it.qty) || 1);
      orderItems.push({
        productId: String(p._id),
        name: p.name,
        price: p.price,
        qty,
        image: p.image,
      });
      total += p.price * qty;
    }

    const order = await Order.create({
      customerName,
      phone,
      address,
      items: orderItems,
      total,
    });
    res.status(201).json({ message: "Order placed", id: order._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Customer: phone number tho order status chudadam (address etc. ivvamu)
router.get("/track", async (req, res) => {
  try {
    const phone = String(req.query.phone || "").trim();
    if (phone.length < 6) {
      return res.status(400).json({ message: "Enter a valid phone number" });
    }
    const orders = await Order.find({ phone }).sort({ createdAt: -1 }).limit(10);
    res.json(
      orders.map((o) => ({
        id: o._id,
        status: o.status,
        total: o.total,
        createdAt: o.createdAt,
        items: o.items.map((i) => ({ name: i.name, qty: i.qty })),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: anni orders
router.get("/", adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: status marchadam
router.put("/:id", adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;