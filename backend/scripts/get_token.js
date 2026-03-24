require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const getToken = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'edemahitharenu@gmail.com';
        const user = await User.findOne({ email });

        if (user && user.resetPasswordToken) {
            console.log('RESET_TOKEN:' + user.resetPasswordToken);
        } else {
            console.log('User not found or no token');
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

getToken();
