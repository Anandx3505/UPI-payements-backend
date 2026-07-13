import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'UPI Payments Backend API',
    description: 'API documentation for the basic UPI transaction backend.',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
      description: 'Standard Authorization using cookies'
    }
  }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/app.js'];

// Generate swagger.json
swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log("Swagger documentation generated successfully.");
});
