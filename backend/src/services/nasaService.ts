import axios from "axios";
import dotenv from "dotenv";
import { Asteroid,NasaNeoWsResponse } from "../types/asteroid";
import { dot } from "node:test/reporters";
    
dotenv.config(); // to be able to read .env file

const NASA_API_URL = 'https://api.nasa.gov/neo/rest/v1/feed';
const API_KEY = process.env.NASA_API_KEY;


// RISK ANALYSIS ALGORITHM
// Caclulate a custom score based on size, velocity, and proximity.

const calculateRiskScore = (diameterMax: number, velocity: number, missDistance: number, isHazardous: boolean): { score: number, level: Asteroid['risk_level'] } => {
  // Normalize factors since they can be vary a lot 
  const sizeFactor = diameterMax * 10; 
  const velocityFactor = velocity / 1000;
  const distanceFactor = 100000000 / missDistance; // Closer = Higher score
  
  let rawScore = (sizeFactor + velocityFactor + distanceFactor);
  
  // Boosting the score if NASA already flags it as hazardous
  if (isHazardous) rawScore *= 1.5;

  // Cutting the score to 0-100 scale logically
  const score = Math.min(Math.max(parseFloat(rawScore.toFixed(2)), 0), 100);

  let level: Asteroid['risk_level'] = 'Low';
  if (score > 80) level = 'Extreme';
  else if (score > 50) level = 'Critical';
  else if (score > 20) level = 'Moderate';

  return { score, level };
};

export const fetchAsteroidFeed = async (startDate: string, endDate: string): Promise<Asteroid[]> => {
  try {
    const response = await axios.get<NasaNeoWsResponse>(NASA_API_URL, {
      params: {
        start_date: startDate,  
        end_date: endDate,
        api_key: API_KEY
      }
    });

    const rawData = response.data.near_earth_objects;
    const asteroids: Asteroid[] = [];

    // Convert the date-based object into a single array
    Object.values(rawData).forEach((dayList: any[]) => {
      dayList.forEach((neo) => {
        const approachData = neo.close_approach_data[0];
        const diameterMax = neo.estimated_diameter.kilometers.estimated_diameter_max;
        const velocity = parseFloat(approachData.relative_velocity.kilometers_per_hour);
        const missDistance = parseFloat(approachData.miss_distance.kilometers);

        const riskAnalysis = calculateRiskScore(diameterMax, velocity, missDistance, neo.is_potentially_hazardous_asteroid);

        asteroids.push({
          id: neo.id,
          name: neo.name,
          is_hazardous: neo.is_potentially_hazardous_asteroid,
          absolute_magnitude: neo.absolute_magnitude_h,
          estimated_diameter_km: {
            min: neo.estimated_diameter.kilometers.estimated_diameter_min,
            max: diameterMax
          },
          close_approach_data: {
            date: approachData.close_approach_date_full,
            velocity_kmh: parseFloat(approachData.relative_velocity.kilometers_per_hour).toFixed(2),
            miss_distance_km: parseFloat(approachData.miss_distance.kilometers).toFixed(2),
            orbiting_body: approachData.orbiting_body
          },
          risk_score: riskAnalysis.score,
          risk_level: riskAnalysis.level
        });
      });
    });

    // Sort by Risk Score (Highest Risk First)
    return asteroids.sort((a, b) => b.risk_score - a.risk_score);

  } catch (error) {
    console.error('Error fetching NASA data:', error);
    throw new Error('Failed to fetch asteroid data');
  }
};