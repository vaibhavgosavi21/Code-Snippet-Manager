const express = require('express');
const Snippet = require('../models/Snippet');
const Activity = require('../models/Activity');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all snippets (public platform)
router.get('/', auth, async (req, res) => {
  try {
    const snippets = await Snippet.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's own snippets
router.get('/my-snippets', auth, async (req, res) => {
  try {
    const snippets = await Snippet.find({ userId: req.user._id })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create snippet
router.post('/', auth, async (req, res) => {
  try {
    const snippet = new Snippet({ ...req.body, userId: req.user._id });
    await snippet.save();
    
    await new Activity({ 
      userId: req.user._id, 
      action: 'create_snippet', 
      details: `Created snippet: ${snippet.title}` 
    }).save();

    res.status(201).json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update snippet (only by owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'username email');
    
    if (!snippet) return res.status(404).json({ message: 'Snippet not found or unauthorized' });
    
    await new Activity({ 
      userId: req.user._id, 
      action: 'update_snippet', 
      details: `Updated snippet: ${snippet.title}` 
    }).save();

    res.json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete snippet (only by owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!snippet) return res.status(404).json({ message: 'Snippet not found or unauthorized' });
    
    await new Activity({ 
      userId: req.user._id, 
      action: 'delete_snippet', 
      details: `Deleted snippet: ${snippet.title}` 
    }).save();

    res.json({ message: 'Snippet deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;