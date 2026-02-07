// defining how the asteroid be like 
export interface NasaNeoWsResponse {
  near_earth_objects: {
    [date: string]: any[];
  };
  element_count: number;
}

export interface Asteroid {
  id: string;
  name: string;
  is_hazardous: boolean;
  absolute_magnitude: number;
  estimated_diameter_km: {
    min: number;
    max: number;
  };
  close_approach_data: {
    date: string;
    velocity_kmh: string;
    miss_distance_km: string;
    orbiting_body: string;
  };
  risk_score: number; //  custom metric
  risk_level: 'Low' | 'Moderate' | 'Critical' | 'Extreme'; // User-friendly label
}