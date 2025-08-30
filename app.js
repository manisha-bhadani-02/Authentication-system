import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDb from './config/connectdb.js';

// Import routes and swagger
import userRoutes from './routes/userRoutes.js';
import { specs, swaggerUi } from './swagger.js';

const app = express();

// Port (Render automatically sets process.env.PORT)
const PORT = process.env.PORT || 8000;

// Database connection
connectDb();

// Middleware
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Authentication System API Docs"
}));

// Load Routes
app.use("/api/user", userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  const protocol = req.protocol;    // http or https
  const host = req.get('host');     // domain or localhost
  res.json({
    message: 'Authentication System API',
    documentation: `${protocol}://${host}/api-docs`,
    version: '1.0.0'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
