const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// Összes bejegyzés lekérése
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar performanceLevel')
      .populate('comments.user', 'name avatar');
    res.json(posts);
  } catch (err) {
    console.error('Bejegyzések lekérési hiba:', err);
    res.status(500).json({ error: 'Szerver hiba történt' });
  }
});

// Új bejegyzés létrehozása
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, image } = req.body;
    const post = new Post({
      user: req.user.id,
      content,
      image
    });
    await post.save();
    await post.populate('user', 'name avatar performanceLevel');
    res.status(201).json(post);
  } catch (err) {
    console.error('Bejegyzés létrehozási hiba:', err);
    res.status(500).json({ error: 'Szerver hiba történt' });
  }
});

// Bejegyzés módosítása
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Bejegyzés nem található' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Nincs jogosultságod a módosításhoz' });
    }
    const { content, image } = req.body;
    post.content = content;
    post.image = image;
    await post.save();
    await post.populate('user', 'name avatar performanceLevel');
    res.json(post);
  } catch (err) {
    console.error('Bejegyzés módosítási hiba:', err);
    res.status(500).json({ error: 'Szerver hiba történt' });
  }
});

// Bejegyzés törlése
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Bejegyzés nem található' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Nincs jogosultságod a törléshez' });
    }
    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: 'Bejegyzés törölve' });
  } catch (err) {
    console.error('Bejegyzés törlési hiba:', err);
    res.status(500).json({ error: 'Szerver hiba történt' });
  }
});

// Bejegyzés likeolása
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Bejegyzés nem található' });
    }
    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(likeIndex, 1);
    }
    await post.save();
    await post.populate('user', 'name avatar performanceLevel');
    await post.populate('comments.user', 'name avatar');
    res.json(post);
  } catch (err) {
    console.error('Like hiba:', err);
    res.status(500).json({ error: 'Szerver hiba történt' });
  }
});

// Komment hozzáadása
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Bejegyzés nem található' });
    }
    const { content } = req.body;
    post.comments.push({
      user: req.user.id,
      content
    });
    await post.save();
    await post.populate('user', 'name avatar performanceLevel');
    await post.populate('comments.user', 'name avatar');
    res.json(post);
  } catch (err) {
    console.error('Komment hozzáadási hiba:', err);
    res.status(500).json({ error: 'Szerver hiba történt' });
  }
});

module.exports = router; 