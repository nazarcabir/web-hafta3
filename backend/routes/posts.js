const express = require('express');
const slugify = require('slugify');
const Post = require('../models/Post');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts (with pagination & category filter)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        // Admin request vs Public request check via middleware isn't here natively, 
        // so we just return 'active' posts by default unless queried differently maybe.
        // Given the simplicity, we'll return all active posts.
        let query = { status: 'active' };

        // category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        const count = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('author', 'username profilePic')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        res.json({ posts, page, pages: Math.ceil(count / pageSize), count });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// @route   GET /api/posts/admin
// @desc    Get all posts (including suspended)
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'username email')
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// @route   GET /api/posts/by-slug/:slug
// @desc    Get post by slug
// @access  Public
router.get('/by-slug/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
            .populate('author', 'username profilePic')
            .populate('category', 'name slug');

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Yazı bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username profilePic')
            .populate('category', 'name slug');

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Yazı bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, content, category, image } = req.body;
        let baseSlug = slugify(title, { lower: true, strict: true, locale: 'tr' });
        let slug = baseSlug;

        // Ensure slug uniqueness
        let slugExists = await Post.findOne({ slug });
        let counter = 1;
        while (slugExists) {
            slug = `${baseSlug}-${counter}`;
            slugExists = await Post.findOne({ slug });
            counter++;
        }

        const post = new Post({
            title,
            slug,
            content,
            author: req.user._id,
            category: category || null,
            image: image || '',
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { title, content, category, image } = req.body;
        const post = await Post.findById(req.params.id);

        if (post) {
            // Check ownership or admin
            if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Yetkisiz işlem' });
            }

            post.title = title || post.title;
            if (title && title !== post.title) {
                post.slug = slugify(title, { lower: true, strict: true, locale: 'tr' });
            }
            post.content = content || post.content;
            post.category = category || post.category;
            post.image = image !== undefined ? image : post.image;

            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Yazı bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Yetkisiz işlem' });
            }
            await Post.deleteOne({ _id: post._id });
            res.json({ message: 'Yazı silindi' });
        } else {
            res.status(404).json({ message: 'Yazı bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// @route   PUT /api/posts/:id/like
// @desc    Like / Unlike a post
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            const isLiked = post.likes.includes(req.user._id);

            if (isLiked) {
                post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
            } else {
                post.likes.push(req.user._id);
            }

            await post.save();
            res.json(post.likes);
        } else {
            res.status(404).json({ message: 'Yazı bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

// @route   PUT /api/posts/:id/status
// @desc    Change post status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            post.status = req.body.status || 'active';
            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Yazı bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
});

module.exports = router;
