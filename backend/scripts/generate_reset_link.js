require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const crypto = require('crypto');
const fs = require('fs');

const generateLink = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'edemahitharenu@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            fs.writeFileSync('token.txt', 'User not found');
            process.exit(1);
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        fs.writeFileSync('token.txt', resetToken);
        console.log('Token written to token.txt');

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

generateLink();
