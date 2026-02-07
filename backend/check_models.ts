import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing from .env file");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log(`📡 Connecting to Google AI...`);

axios.get(url)
  .then(res => {
    console.log("\n✅ SUCCESS! Here are the models available to your key:\n");
    
    const validModels = res.data.models.filter((m: any) => 
      // We only care about models that can generate text (generateContent)
      m.supportedGenerationMethods.includes("generateContent")
    );

    validModels.forEach((m: any) => {
      // Print the clean name (e.g., "gemini-pro")
      console.log(`🔹 Model Name: ${m.name.replace("models/", "")}`);
      console.log(`   Description: ${m.description.substring(0, 60)}...`);
      console.log("------------------------------------------------");
    });

    if (validModels.length === 0) {
      console.log("⚠ WARNING: No text-generation models found. Your key might be restricted.");
    }
  })
  .catch(err => {
    console.error("\n❌ FAILED TO LIST MODELS:");
    if (err.response) {
      console.error(`   Status: ${err.response.status}`);
      console.error(`   Reason: ${JSON.stringify(err.response.data, null, 2)}`);
    } else {
      console.error(`   Error: ${err.message}`);
    }
  });