import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication System API',
      version: '1.0.0',
      description: 'A comprehensive authentication system with JWT, password reset, and user management',
      contact: {
        name: 'Manisha Bhadani',
        email: 'manisha@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: "https://authentication-system-vaur.onrender.com",
        description: "Production server (Render)"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
