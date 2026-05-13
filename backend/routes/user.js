/**
 * Gitaarth AI — User Routes
 * /api/user — Profile, history, bookmarks (auth required).
 */

import { Router } from 'express';
import * as ctrl from '../controllers/userController.js';

const router = Router();

// All user routes will require auth middleware (added in server.js or here later)
// For now, these routes expect req.userId to be set by auth middleware.

router.get('/profile', ctrl.getProfile);
router.patch('/language', ctrl.updateLanguage);

router.get('/conversations', ctrl.getConversations);
router.get('/conversations/:id', ctrl.getConversation);

router.get('/bookmarks', ctrl.getBookmarks);
router.post('/bookmarks', ctrl.createBookmark);
router.delete('/bookmarks/:id', ctrl.deleteBookmark);

export default router;
