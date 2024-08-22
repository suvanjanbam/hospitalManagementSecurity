const bcrypt = require('bcryptjs');
const userModel = require('../models/userModels');

const setupAdminUser = async () => {
    try {
      // Check if the admin user already exists
      const existingAdmin = await userModel.findOne({ email: process.env.ADMIN_EMAIL });
      if (existingAdmin) {
        console.log('Admin user already exists.');
        return;
      }
  
      // Hash the admin password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
  
      // Create a new admin user
      const adminUser = new userModel({
        name: 'Admin User', // Adjust name as necessary
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        isAdmin: true,
        passwordCreationDate: Date.now()
      });
  
      // Save the admin user to the database
      await adminUser.save();
      console.log('Admin user created successfully.');
  
      // Close the database connection
      // await mongoose.disconnect();
    } catch (error) {
      console.error('Error setting up admin user:', error);
      process.exit(1); // Exit with failure code
    }
  };
  module.exports = setupAdminUser;