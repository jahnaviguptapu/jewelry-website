const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: 0 },
    badge: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: [
        "silver-neck-sets",
        "black-beads",
        "necklace-sets",
        "earrings",
        "chains",
        "rings",
        "bangles",
        "bracelets",
      ],
    },
    subCategory: { type: String, default: "" },
    material: { type: String, default: "Rolled Gold" },
    image: { type: String, default: "" },
    tryOn: { type: String, default: "" },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);