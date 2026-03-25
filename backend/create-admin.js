import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (adminUser) {
      console.log(`An admin user already exists. Email: ${adminUser.email}`);
    } else {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@sundrip.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log(`Created new admin user!`);
      console.log(`Email: admin@sundrip.com`);
      console.log(`Password: admin123`);
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
