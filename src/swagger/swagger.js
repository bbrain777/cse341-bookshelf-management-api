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
  info: {
    title: "Bookshelf Management API",
    version: "1.0.0",
    description: "OAuth-protected bookshelf/library management API",
  },
  servers,
  components: {
    securitySchemes: {
      SessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
        description: "Session cookie returned after OAuth login",
      },
    },
    schemas: {
      Book: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          author: { type: "string" },
          authorId: { type: "string" },
          isbn: { type: "string" },
          genre: { type: "string" },
          copiesAvailable: { type: "integer" },
          shelfNumber: { type: "string" },
          status: { type: "string", enum: ["reading", "completed", "planned"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Author: {
        type: "object",
        properties: {
          _id: { type: "string" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          nationality: { type: "string" },
          genres: { type: "array", items: { type: "string" } },
          bio: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Shelf: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          ownerUserId: { type: "string" },
          visibility: { type: "string", enum: ["private", "shared", "public"] },
          bookIds: { type: "array", items: { type: "string" } },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Member: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Loan: {
        type: "object",
        properties: {
          _id: { type: "string" },
          bookId: { type: "string" },
          memberId: { type: "string" },
          loanDate: { type: "string", format: "date-time" },
          dueDate: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["active", "returned", "overdue"] },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          oauthProvider: { type: "string" },
          providerId: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["member", "admin"] },
        },
      },
    },
  },
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Books" },
    { name: "Authors" },
    { name: "Shelves" },
    { name: "Members" },
    { name: "Loans" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: { 200: { description: "OK" } },
      },
    },
    "/auth/login": {
      get: {
        tags: ["Auth"],
        summary: "Start GitHub OAuth flow",
        responses: { 302: { description: "Redirect to GitHub" } },
      },
    },
    "/auth/callback": {
      get: {
        tags: ["Auth"],
        summary: "GitHub OAuth callback",
        responses: { 302: { description: "Redirect after auth" } },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        security: [{ SessionCookie: [] }],
        responses: {
          200: { description: "Authenticated user", content: { "application/json": { schema: { type: "object", properties: { data: { $ref: "#/components/schemas/User" } } } } } },
          401: { description: "Not authenticated" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout current session",
        security: [{ SessionCookie: [] }],
        responses: {
          200: { description: "Logged out" },
          500: { description: "Logout failed" },
        },
      },
    },
    "/books": {
      get: {
        tags: ["Books"],
        summary: "List books",
        parameters: [
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "genre", in: "query", schema: { type: "string" } },
          { name: "authorId", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Books"],
        summary: "Create book (admin)",
        security: [{ SessionCookie: [] }],
        responses: { 201: { description: "Created" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
    },
    "/books/{id}": {
      get: {
        tags: ["Books"],
        summary: "Get book by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 404: { description: "Not found" } },
      },
      put: {
        tags: ["Books"],
        summary: "Update book (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Updated" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
      delete: {
        tags: ["Books"],
        summary: "Delete book (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
    },
    "/authors": {
      get: { tags: ["Authors"], summary: "List authors", responses: { 200: { description: "OK" } } },
      post: {
        tags: ["Authors"],
        summary: "Create author (admin)",
        security: [{ SessionCookie: [] }],
        responses: { 201: { description: "Created" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
    },
    "/authors/{id}": {
      get: {
        tags: ["Authors"],
        summary: "Get author by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 404: { description: "Not found" } },
      },
      put: {
        tags: ["Authors"],
        summary: "Update author (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Updated" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
      delete: {
        tags: ["Authors"],
        summary: "Delete author (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
    },
    "/shelves": {
      get: {
        tags: ["Shelves"],
        summary: "List shelves",
        parameters: [
          { name: "ownerUserId", in: "query", schema: { type: "string" } },
          { name: "visibility", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Shelves"],
        summary: "Create shelf (authenticated)",
        security: [{ SessionCookie: [] }],
        responses: { 201: { description: "Created" }, 401: { description: "Unauthorized" } },
      },
    },
    "/shelves/{id}": {
      get: {
        tags: ["Shelves"],
        summary: "Get shelf by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 404: { description: "Not found" } },
      },
      put: {
        tags: ["Shelves"],
        summary: "Update shelf (owner or admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Updated" }, 401: { description: "Unauthorized" }, 403: { description: "Forbidden" } },
      },
      delete: {
        tags: ["Shelves"],
        summary: "Delete shelf (owner or admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 403: { description: "Forbidden" } },
      },
    },
    "/members": {
      get: {
        tags: ["Members"],
        summary: "List members (admin)",
        security: [{ SessionCookie: [] }],
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
      post: {
        tags: ["Members"],
        summary: "Create member (admin)",
        security: [{ SessionCookie: [] }],
        responses: { 201: { description: "Created" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
    },
    "/members/{id}": {
      get: {
        tags: ["Members"],
        summary: "Get member by id (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
      put: {
        tags: ["Members"],
        summary: "Update member (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Updated" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
      delete: {
        tags: ["Members"],
        summary: "Delete member (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
    },
    "/loans": {
      get: {
        tags: ["Loans"],
        summary: "List loans (admin)",
        security: [{ SessionCookie: [] }],
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
      post: {
        tags: ["Loans"],
        summary: "Create loan (admin)",
        security: [{ SessionCookie: [] }],
        responses: { 201: { description: "Created" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
    },
    "/loans/{id}": {
      get: {
        tags: ["Loans"],
        summary: "Get loan by id (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
      put: {
        tags: ["Loans"],
        summary: "Update loan (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Updated" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
      delete: {
        tags: ["Loans"],
        summary: "Delete loan (admin)",
        security: [{ SessionCookie: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 403: { description: "Admins only" } },
      },
    },
  },
};

function swaggerSetup(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}

module.exports = { swaggerSetup };
