import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();


// connecting to mongodb
import connectDB from './config/db';
connectDB();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow frontend requests
app.use(express.json());

// Routes
app.use('/api', routes);

// Health Check
app.get('/', (req, res) => {
  res.send('Cosmic Watch Backend is Active');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});