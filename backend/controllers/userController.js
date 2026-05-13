/**
 * Gitaarth AI — User Controller
 * Handles user profile, bookmarks, and conversation history.
 */

import Conversation from '../models/Conversation.js';
import Bookmark from '../models/Bookmark.js';
import User from '../models/User.js';

/** GET /api/user/profile — Get user profile */
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('❌ Profile error:', err.message);
    res.status(500).json({ error: 'Could not fetch profile.' });
  }
}

/** PATCH /api/user/language — Update language preference */
export async function updateLanguage(req, res) {
  try {
    const { language } = req.body;
    const valid = ['en', 'hi', 'te', 'ta', 'kn', 'sa'];
    if (!valid.includes(language)) {
      return res.status(400).json({ error: 'Invalid language code.' });
    }

    await User.findByIdAndUpdate(req.userId, { language });
    res.json({ success: true, language });
  } catch (err) {
    console.error('❌ Update language error:', err.message);
    res.status(500).json({ error: 'Could not update language.' });
  }
}

/** GET /api/user/conversations — List user's past conversations */
export async function getConversations(req, res) {
  try {
    const conversations = await Conversation.find({ userId: req.userId })
      .select('title language lastMessageAt createdAt')
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .lean();

    res.json({ conversations });
  } catch (err) {
    console.error('❌ Conversations error:', err.message);
    res.status(500).json({ error: 'Could not fetch conversations.' });
  }
}

/** GET /api/user/conversations/:id — Get a full conversation */
export async function getConversation(req, res) {
  try {
    const convo = await Conversation.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).lean();

    if (!convo) return res.status(404).json({ error: 'Conversation not found.' });
    res.json({ conversation: convo });
  } catch (err) {
    console.error('❌ Get conversation error:', err.message);
    res.status(500).json({ error: 'Could not fetch conversation.' });
  }
}

/** POST /api/user/bookmarks — Create a bookmark */
export async function createBookmark(req, res) {
  try {
    const { type, referenceId, snapshot } = req.body;

    if (!['shloka', 'ramquote', 'message'].includes(type)) {
      return res.status(400).json({ error: 'Invalid bookmark type.' });
    }

    const bookmark = await Bookmark.create({
      userId: req.userId,
      type,
      referenceId,
      snapshot: snapshot || {},
    });

    res.status(201).json({ bookmark });
  } catch (err) {
    // Duplicate bookmark
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Already bookmarked.' });
    }
    console.error('❌ Bookmark error:', err.message);
    res.status(500).json({ error: 'Could not create bookmark.' });
  }
}

/** GET /api/user/bookmarks — List user's bookmarks */
export async function getBookmarks(req, res) {
  try {
    const bookmarks = await Bookmark.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ bookmarks });
  } catch (err) {
    console.error('❌ Get bookmarks error:', err.message);
    res.status(500).json({ error: 'Could not fetch bookmarks.' });
  }
}

/** DELETE /api/user/bookmarks/:id — Remove a bookmark */
export async function deleteBookmark(req, res) {
  try {
    const result = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!result) return res.status(404).json({ error: 'Bookmark not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Delete bookmark error:', err.message);
    res.status(500).json({ error: 'Could not delete bookmark.' });
  }
}
