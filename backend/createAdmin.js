require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const EMAIL = "bandiguptapujahnavi@gmail.com";
const PASSWORD = "Anil@1987";

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: EMAIL });
  if (exists) {
    console.log("Admin already exists");
  } else {
    await User.create({
      name: "Admin",
      email: EMAIL,
      password: await bcrypt.hash(PASSWORD, 10),
      isAdmin: true,
    });
    console.log("Admin created ✅");
  }
  process.exit(0);
})();