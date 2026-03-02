const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const Post = require('./models/Post');

dotenv.config();

const migrateSlugs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogdb');
        console.log('MongoDB Connected');

        const posts = await Post.find({ slug: { $exists: false } });

        console.log(`${posts.length} yazı güncelleniyor...`);

        for (let post of posts) {
            post.slug = slugify(post.title, { lower: true, strict: true, locale: 'tr' });
            await post.save();
            console.log(`Güncellendi: ${post.title}`);
        }

        console.log('Migrasyon tamamlandı!');
        process.exit(0);
    } catch (error) {
        console.error(`Hata: ${error.message}`);
        process.exit(1);
    }
};

migrateSlugs();
