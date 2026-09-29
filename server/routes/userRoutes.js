import express from 'express';
import {
  getUserProfile,
  updateProfile,
  searchUsers,
  followUser,
  unfollowUser,
  getSuggestions,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', searchUsers);
router.get('/suggestions', getSuggestions);
router.get('/profile', (req, res, next) => {
  req.params.id = 'me';
  getUserProfile(req, res, next);
});
router.get('/:id', getUserProfile);
router.put('/profile', updateProfile);
router.post('/:id/follow', followUser);
router.post('/:id/unfollow', unfollowUser);

export default router;
