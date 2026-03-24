const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config(); // Load .env from current directory (backend)

const checkUsers = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const users = await User.find({}).select('name email role');

        console.log('\n--- User List ---');
        users.forEach(user => {
            console.log(`ID: ${user._id} | Name: ${user.name} | Role: ${user.role} | Email: ${user.email}`);
        });
        console.log('-----------------\n');

        mongoose.connection.close();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkUsers();
