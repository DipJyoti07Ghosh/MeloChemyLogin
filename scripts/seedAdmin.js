require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

(async ()=>{
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASS || 'Admin123!';
  const hashed = await bcrypt.hash(password, 10);
  const u = await User.findOneAndUpdate({email}, {
    username: 'admin',
    email,
    password: hashed,
    role: 'admin'
  }, { upsert: true, new: true });
  console.log('Admin seeded', u.email);
  process.exit();
})();