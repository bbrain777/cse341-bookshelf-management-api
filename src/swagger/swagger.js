const swaggerUi = require("swagger-ui-express");

const swaggerDoc = {
  openapi: "3.0.0",
  info: { title: "Bookshelf Management API", version: "1.0.0" },
  paths: {
    "/health": {
      get: { summary: "Health check", responses: { 200: { description: "OK" } } }
    }
  }
};

function swaggerSetup(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

module.exports = { swaggerSetup };
