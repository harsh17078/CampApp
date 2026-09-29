import express from 'express';
import { getUserProfile, updateProfile, searchUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', searchUsers);
router.get('/profile', (req, res, next) => {
  req.params.id = 'me';
  getUserProfile(req, res, next);
});
router.get('/:id', getUserProfile);
router.put('/profile', updateProfile);

export default router;
