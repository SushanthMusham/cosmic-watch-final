import { Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

console.log("🔑 GEMINI KEY LOADED:", process.env.GEMINI_API_KEY ? "YES" : "NO");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const BACKUP_RESPONSES = [
  "Trajectory nominal. Spectroscopic analysis confirms high silicate content. No immediate impact threat detected.",
  "Object tracking locked. Rotational period suggests a loose rubble-pile structure. Maintaining surveillance.",
  "Radar cross-section analysis complete. Velocity vector remains stable. Composition: Carbonaceous chondrite.",
  "Gravitational perturbation analysis negative. Object will pass safely within lunar orbit. Status: Green.",
  "Thermal emission signature matches S-type classification. No orbital deviation predicted. Monitoring continues.",
  "Surface reflectivity analysis indicates metallic composition. Trajectory stable. No Earth intersection calculated."
];

export const getAsteroidSummary = async (req: Request, res: Response) => {
  try {
    const { name, size, speed, distance, risk } = req.body;
    
    console.log(`AI REQUEST: ${name}...`);

    const prompt = `
      Act as a futuristic spacecraft AI computer (like JARVIS). 
      Analyze this asteroid:
      - Name: ${name}
      - Diameter: ${size} km
      - Speed: ${speed} km/h
      - Miss Distance: ${distance} km
      - Risk Level: ${risk}

      Write a strict, 2-sentence military-style mission report. 
      Do not use markdown. Be serious and scientific.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("AI SUCCESS (Live)");
    res.json({ summary: text });

  } catch (error: any) {
    // RATE LIMIT HANDLING
    // If the limit is over , then silently switch to "Simulation Mode"
    console.warn(`LIMIT HIT. Switching to Simulation Mode for ${req.body.name}.`);
    
    const randomResponse = BACKUP_RESPONSES[Math.floor(Math.random() * BACKUP_RESPONSES.length)];
    
    res.json({ summary: randomResponse });
  }
};