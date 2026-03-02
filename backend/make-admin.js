const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogdb');
        console.log('MongoDB Connected');

        const email = process.argv[2];

        if (!email) {
            console.error('Lütfen bir e-posta adresi girin: node make-admin.js <email>');
            process.exit(1);
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.error('Kullanıcı bulunamadı');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`${user.username} kullanıcısı artık admin!`);
        process.exit(0);
    } catch (error) {
        console.error(`Hata: ${error.message}`);
        process.exit(1);
    }
};

makeAdmin();
