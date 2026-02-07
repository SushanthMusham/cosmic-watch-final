import { Request, Response } from 'express';
import { fetchAsteroidFeed } from '../services/nasaService';

export const getAsteroids = async (req: Request, res: Response) => {
  try {
    // Default to today's date if not provided for both start and end date
    const today = new Date().toISOString().split('T')[0];
    const startDate = (req.query.start_date as string) || today;
    const endDate = (req.query.end_date as string) || today;

    // fetching the aestroids data from NASA
    const asteroids = await fetchAsteroidFeed(startDate, endDate);
    
    res.json({
      success: true,
      count: asteroids.length,
      data: asteroids
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching asteroids' });
  }
};