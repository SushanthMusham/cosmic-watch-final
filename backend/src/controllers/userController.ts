import { Request, Response } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}



export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        watchedAsteroids: user.watchedAsteroids
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export const addWatchedAsteroid = async (req: AuthRequest, res: Response) => {
  try {
    const { asteroidId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      // Avoid duplicates
      if (!user.watchedAsteroids.includes(asteroidId)) {
        user.watchedAsteroids.push(asteroidId);
        await user.save();
      }
      res.json(user.watchedAsteroids);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export const removeWatchedAsteroid = async (req: AuthRequest, res: Response) => {
  try {
    const asteroidId = req.params.id;
    const user = await User.findById(req.user._id);

    if (user) {
      user.watchedAsteroids = user.watchedAsteroids.filter((id) => id !== asteroidId);
      await user.save();
      res.json(user.watchedAsteroids);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};