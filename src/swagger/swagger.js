const swaggerUi = require("swagger-ui-express");

const swaggerDoc = {
  openapi: "3.0.0",
  info: { title: "Bookshelf Management API", version: "1.0.0" },
  servers: [
    { url: process.env.BASE_URL || "http://localhost:8080" }
  ],
  components: {
    schemas: {
      Book: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64f1c9c2b2d1d9a7c8f1a111" },
          title: { type: "string", example: "Clean Code" },
          author: { type: "string", example: "Robert C. Martin" },
          isbn: { type: "string", example: "9780132350884" },
          genre: { type: "string", example: "Software Engineering" },
          authorPlaceOfBirth: { type: "string", example: "Chicago, IL, USA" },
          copiesAvailable: { type: "integer", example: 3 },
          shelfNumber: { type: "string", example: "A-12" },
          status: {
            type: "string",
            enum: ["reading", "completed", "planned"],
            example: "reading"
          },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      BookInput: {
        type: "object",
        required: [
          "title",
          "author",
          "genre",
          "authorPlaceOfBirth",
          "copiesAvailable",
          "shelfNumber"
        ],
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          isbn: { type: "string" },
          genre: { type: "string" },
          authorPlaceOfBirth: { type: "string" },
          copiesAvailable: { type: "integer", minimum: 0 },
          shelfNumber: { type: "string" },
          status: { type: "string", enum: ["reading", "completed", "planned"] }
        }
      },
      BookUpdate: {
        type: "object",
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          isbn: { type: "string" },
          genre: { type: "string" },
          authorPlaceOfBirth: { type: "string" },
          copiesAvailable: { type: "integer", minimum: 0 },
          shelfNumber: { type: "string" },
          status: { type: "string", enum: ["reading", "completed", "planned"] }
        }
      },
      Author: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64f1c9c2b2d1d9a7c8f1a222" },
          firstName: { type: "string", example: "Chimamanda" },
          lastName: { type: "string", example: "Adichie" },
          nationality: { type: "string", example: "Nigerian" },
          birthYear: { type: "integer", example: 1977 },
          genres: { type: "array", items: { type: "string" }, example: ["Fiction"] },
          bio: { type: "string", example: "Award-winning novelist and essayist." },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      AuthorInput: {
        type: "object",
        required: ["firstName", "lastName", "nationality", "birthYear", "genres", "bio"],
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          nationality: { type: "string" },
          birthYear: { type: "integer", minimum: 0 },
          genres: { type: "array", items: { type: "string" } },
          bio: { type: "string" }
        }
      },
      AuthorUpdate: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          nationality: { type: "string" },
          birthYear: { type: "integer", minimum: 0 },
          genres: { type: "array", items: { type: "string" } },
          bio: { type: "string" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: { summary: "Health check", responses: { 200: { description: "OK" } } }
    },
    "/books": {
      get: {
        summary: "List books",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/Book" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Create a book",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookInput" }
            }
          }
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Book" } }
                }
              }
            }
          },
          400: { description: "Validation error" }
        }
      }
    },
    "/books/{id}": {
      get: {
        summary: "Get a book by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Book" } }
                }
              }
            }
          },
          400: { description: "Invalid id" },
          404: { description: "Not found" }
        }
      },
      put: {
        summary: "Update a book",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookUpdate" }
            }
          }
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Book" } }
                }
              }
            }
          },
          400: { description: "Validation error" },
          404: { description: "Not found" }
        }
      },
      delete: {
        summary: "Delete a book",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Book" } }
                }
              }
            }
          },
          400: { description: "Invalid id" },
          404: { description: "Not found" }
        }
      }
    },
    "/authors": {
      get: {
        summary: "List authors",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/Author" } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: "Create an author",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthorInput" }
            }
          }
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Author" } }
                }
              }
            }
          },
          400: { description: "Validation error" }
        }
      }
    },
    "/authors/{id}": {
      get: {
        summary: "Get an author by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Author" } }
                }
              }
            }
          },
          400: { description: "Invalid id" },
          404: { description: "Not found" }
        }
      },
      put: {
        summary: "Update an author",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthorUpdate" }
            }
          }
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Author" } }
                }
              }
            }
          },
          400: { description: "Validation error" },
          404: { description: "Not found" }
        }
      },
      delete: {
        summary: "Delete an author",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "Deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Author" } }
                }
              }
            }
          },
          400: { description: "Invalid id" },
          404: { description: "Not found" }
        }
      }
    }
  }
};

function swaggerSetup(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

module.exports = { swaggerSetup };
