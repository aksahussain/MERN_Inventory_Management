const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const updateRole = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Update all users to admin for dev simplicity, or specific user
        const result = await User.updateMany({}, { role: 'admin' });

        console.log(`Updated ${result.modifiedCount} users to 'admin' role.`);

        mongoose.connection.close();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

updateRole();
