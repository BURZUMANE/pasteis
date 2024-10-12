const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Logistics Management API',
      version: '1.0.0',
      description: 'A simple API to manage vehicles and orders for fleet management',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./controllers/*.ts'], 
};
