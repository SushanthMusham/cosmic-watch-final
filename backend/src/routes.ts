import { Router } from 'express';
import { getAsteroids } from './controllers/asteroidController';
import { registerUser, loginUser } from './controllers/authController';
import { getUserProfile, addWatchedAsteroid, removeWatchedAsteroid } from './controllers/userController';
import { protect } from './middleware/authMiddleware';
import { getAsteroidSummary } from './controllers/AIController';

const router = Router();

// Public Routes
router.get('/asteroids', getAsteroids);
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/asteroid/summary', getAsteroidSummary);

// Protected Routes (Require Token)
router.get('/user/profile', protect, getUserProfile);
router.post('/user/watch', protect, addWatchedAsteroid);
router.delete('/user/watch/:id', protect, removeWatchedAsteroid);

export default router;