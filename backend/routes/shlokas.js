/**
 * Gitaarth AI — Shloka Routes
 * /api/shlokas — Scripture library endpoints.
 */

import { Router } from 'express';
import * as ctrl from '../controllers/shlokaController.js';

const router = Router();

// Daily shloka (no auth needed)
router.get('/daily', ctrl.daily);

// Chapter metadata
router.get('/chapters', ctrl.chapters);

// List all shlokas (with optional ?chapter=X or ?search=query)
router.get('/', ctrl.list);

// Get a specific shloka
router.get('/:chapter/:verse', ctrl.getOne);

// Ram quotes
router.get('/ramquotes', ctrl.listRamQuotes);

export default router;
