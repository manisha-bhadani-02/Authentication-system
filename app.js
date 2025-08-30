import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import connectDb from './config/connectdb.js';

//import files
import userRoutes from './routes/userRoutes.js';
import { specs, swaggerUi } from './swagger.js';

const app = express();

// port 
const PORT = process.env.PORT || 8000;

//database connection
connectDb();

//middleware
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Authentication System API Docs"
}));

// Load Routes
app.use("/api/user", userRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Authentication System API',
    documentation: 'http://localhost:8000/api-docs',
    version: '1.0.0'
  });
});

app.listen(PORT, ()=>{
    console.log(`server running at http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
})
