import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Metro Cool API",
      version: "1.0.0",
      description: "Metro Cool Backend APIs (Auth, Services, Admin)"
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {} // ✅ REQUIRED for TypeScript, swagger-jsdoc fills this automatically
  },
  apis: ["./src/routes/*.ts"]
});
