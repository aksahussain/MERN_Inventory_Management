require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'mahi@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.name} (${user.email})`);
            console.log(`Current Reset Token: ${user.resetPasswordToken}`);
        } else {
            console.log(`User with email ${email} NOT FOUND.`);
            const allUsers = await User.find({}, 'name email');
            console.log('Existing users:', allUsers);
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
