const swaggerUi = require("swagger-ui-express");

const servers = [];
if (process.env.BASE_URL) {
  servers.push({ url: process.env.BASE_URL });
} else if (process.env.RENDER_EXTERNAL_URL) {
  servers.push({ url: process.env.RENDER_EXTERNAL_URL });
} else {
  servers.push({ url: "http://localhost:8080" });
}

const swaggerDoc = {
  openapi: "3.0.0",
  info: { title: "Bookshelf Management API", version: "1.0.0" },
  servers,
  tags: [
    { name: "Books", description: "Operations about books" },
    { name: "Authors", description: "Operations about authors" },
    { name: "Members", description: "Operations about members" },
    { name: "Loans", description: "Operations about loans" },
    { name: "Health", description: "Health check" },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "Use: Bearer <token>",
      },
    },
    schemas: {
      Book: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64f1c9c2b2d1d9a7c8f1a111" },
          title: { type: "string", example: "Clean Code" },
          author: { type: "string", example: "Robert C. Martin" },
          isbn: { type: "string", example: "9780132350884" },
          genre: { type: "string", example: "Software Engineering" },
          copiesAvailable: { type: "integer", example: 3 },
          shelfNumber: { type: "string", example: "A-12" },
          status: {
            type: "string",
            enum: ["reading", "completed", "planned"],
            example: "reading",
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      BookInput: {
        type: "object",
        required: [
          "title",
          "author",
          "genre",
          "copiesAvailable",
          "shelfNumber",
        ],
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          isbn: { type: "string" },
          genre: { type: "string" },
          copiesAvailable: { type: "integer", minimum: 0 },
          shelfNumber: { type: "string" },
          status: { type: "string", enum: ["reading", "completed", "planned"] },
        },
      },
      BookUpdate: {
        type: "object",
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          isbn: { type: "string" },
          genre: { type: "string" },
          copiesAvailable: { type: "integer", minimum: 0 },
          shelfNumber: { type: "string" },
          status: { type: "string", enum: ["reading", "completed", "planned"] },
        },
      },
      Author: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64f1c9c2b2d1d9a7c8f1a222" },
          firstName: { type: "string", example: "Chimamanda" },
          lastName: { type: "string", example: "Adichie" },
          nationality: { type: "string", example: "Nigerian" },
          genres: {
            type: "array",
            items: { type: "string" },
            example: ["Fiction"],
          },
          bio: {
            type: "string",
            example: "Award-winning novelist and essayist.",
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AuthorInput: {
        type: "object",
        required: ["firstName", "lastName", "nationality", "genres", "bio"],
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          nationality: { type: "string" },
          genres: { type: "array", items: { type: "string" } },
          bio: { type: "string" },
        },
      },
      AuthorUpdate: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          nationality: { type: "string" },
          genres: { type: "array", items: { type: "string" } },
          bio: { type: "string" },
        },
      },
      Member: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64f1c9c2b2d1d9a7c8f1a333" },
          name: { type: "string", example: "Adams Soyama" },
          email: { type: "string", example: "adams@example.com" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      MemberInput: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string" },
          email: { type: "string" },
        },
      },
      MemberUpdate: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
        },
      },
      Loan: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64f1c9c2b2d1d9a7c8f1a444" },
          bookId: { type: "string", example: "64f1c9c2b2d1d9a7c8f1a111" },
          memberId: { type: "string", example: "64f1c9c2b2d1d9a7c8f1a333" },
          loanDate: { type: "string", format: "date-time" },
          dueDate: { type: "string", format: "date-time" },
          status: {
            type: "string",
            enum: ["active", "returned", "overdue"],
            example: "active",
          },
        },
      },
      LoanInput: {
        type: "object",
        required: ["bookId", "memberId"],
        properties: {
          bookId: { type: "string" },
          memberId: { type: "string" },
          dueDate: { type: "string", format: "date-time" },
        },
      },
      LoanUpdate: {
        type: "object",
        properties: {
          dueDate: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["active", "returned", "overdue"] },
        },
      },
    },
  },
  security: [],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        security: [],
        responses: { 200: { description: "OK" } },
      },
    },
    "/books": {
      get: {
        tags: ["Books"],
        summary: "List books",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Book" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Books"],
        summary: "Create a book",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Book" } },
                },
              },
            },
          },
          400: { description: "Validation error" },
        },
      },
    },
    "/books/{id}": {
      get: {
        tags: ["Books"],
        summary: "Get a book by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Book" } },
                },
              },
            },
          },
          400: { description: "Invalid id" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Books"],
        summary: "Update a book",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookUpdate" },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Book" } },
                },
              },
            },
          },
          400: { description: "Validation error" },
          404: { description: "Not found" },
        },
      },
      delete: {
        tags: ["Books"],
        summary: "Delete a book",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Book" } },
                },
              },
            },
          },
          400: { description: "Invalid id" },
          404: { description: "Not found" },
        },
      },
    },
    "/authors": {
      get: {
        tags: ["Authors"],
        summary: "List authors",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Author" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Authors"],
        summary: "Create an author",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthorInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Author" } },
                },
              },
            },
          },
          400: { description: "Validation error" },
        },
      },
    },
    "/authors/{id}": {
      get: {
        tags: ["Authors"],
        summary: "Get an author by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Author" } },
                },
              },
            },
          },
          400: { description: "Invalid id" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Authors"],
        summary: "Update an author",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthorUpdate" },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Author" } },
                },
              },
            },
          },
          400: { description: "Validation error" },
          404: { description: "Not found" },
        },
      },
      delete: {
        tags: ["Authors"],
        summary: "Delete an author",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { data: { $ref: "#/components/schemas/Author" } },
                },
              },
            },
          },
          400: { description: "Invalid id" },
          404: { description: "Not found" },
        },
      },
    },
    "/members": {
      get: {
        tags: ["Members"],
        summary: "List members",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Member" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Members"],
        summary: "Create a member",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MemberInput" },
            },
          },
        },
        responses: {
          201: { description: "Created" },
          400: { description: "Validation error" },
        },
      },
    },
    "/members/{id}": {
      get: {
        tags: ["Members"],
        summary: "Get member by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Members"],
        summary: "Update member",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MemberUpdate" },
            },
          },
        },
        responses: {
          200: { description: "Updated" },
          400: { description: "Validation error" },
        },
      },
      delete: {
        tags: ["Members"],
        summary: "Delete member",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          404: { description: "Not found" },
        },
      },
    },
    "/loans": {
      get: {
        tags: ["Loans"],
        summary: "List loans",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Loan" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Loans"],
        summary: "Create a loan",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoanInput" },
            },
          },
        },
        responses: {
          201: { description: "Created" },
          400: { description: "Validation error" },
        },
      },
    },
    "/loans/{id}": {
      get: {
        tags: ["Loans"],
        summary: "Get loan by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Loans"],
        summary: "Update loan",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoanUpdate" },
            },
          },
        },
        responses: {
          200: { description: "Updated" },
          400: { description: "Validation error" },
        },
      },
      delete: {
        tags: ["Loans"],
        summary: "Delete loan",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          404: { description: "Not found" },
        },
      },
    },
  },
};

function swaggerSetup(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

module.exports = { swaggerSetup };
