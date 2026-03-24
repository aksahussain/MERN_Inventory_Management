require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'mahi@gmail.com';

        let user = await User.findOne({ email });

        if (user) {
            console.log('User already exists');
        } else {
            user = await User.create({
                name: 'Mahi',
                email: email,
                password: 'password123', // Temporary password
                role: 'admin'
            });
            console.log('User created successfully');
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createUser();
