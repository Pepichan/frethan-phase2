import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Frethan Backend API",
      version: "0.1.0",
      description: "Backend REST API documentation for Frethan (ICT302 Phase 2).",
    },
    servers: [{ url: "/" }],
    tags: [
      { name: "Health" },
      { name: "Users" },
      { name: "Auth" },
      { name: "Suppliers" },
      { name: "RFQ" },
      { name: "Orders" },
    ],
    paths: {
      "/api/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                      timestamp: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/users": {
        get: {
          tags: ["Users"],
          summary: "List users",
          responses: { "200": { description: "OK" } },
        },
        post: {
          tags: ["Users"],
          summary: "Create user",
          responses: { "201": { description: "Created" } },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: { "200": { description: "OK" }, "404": { description: "Not found" } },
        },
        put: {
          tags: ["Users"],
          summary: "Update user",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: { "200": { description: "OK" }, "400": { description: "Bad request" } },
        },
        delete: {
          tags: ["Users"],
          summary: "Delete user",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: { "200": { description: "OK" }, "400": { description: "Bad request" } },
        },
      },

      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Current user (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
      },

      "/api/auth/google": {
        get: {
          tags: ["Auth"],
          summary: "Start Google OAuth (placeholder)",
          responses: { "302": { description: "Redirect to callback (demo)" } },
        },
      },
      "/api/auth/google/callback": {
        get: {
          tags: ["Auth"],
          summary: "Google OAuth callback (placeholder)",
          parameters: [
            { name: "code", in: "query", required: false, schema: { type: "string" } },
            { name: "error", in: "query", required: false, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
          },
        },
      },
      "/api/auth/facebook": {
        get: {
          tags: ["Auth"],
          summary: "Start Facebook OAuth (placeholder)",
          responses: { "302": { description: "Redirect to callback (demo)" } },
        },
      },
      "/api/auth/facebook/callback": {
        get: {
          tags: ["Auth"],
          summary: "Facebook OAuth callback (placeholder)",
          parameters: [
            { name: "code", in: "query", required: false, schema: { type: "string" } },
            { name: "error", in: "query", required: false, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
          },
        },
      },
      "/api/auth/wechat": {
        get: {
          tags: ["Auth"],
          summary: "Start WeChat OAuth (demo placeholder)",
          responses: { "302": { description: "Redirect to callback (demo)" } },
        },
      },
      "/api/auth/wechat/callback": {
        get: {
          tags: ["Auth"],
          summary: "WeChat OAuth callback (demo placeholder)",
          parameters: [
            { name: "code", in: "query", required: false, schema: { type: "string" } },
            { name: "error", in: "query", required: false, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "OK" },
            "400": { description: "Bad request" },
          },
        },
      },

      "/api/suppliers": {
        get: {
          tags: ["Suppliers"],
          summary: "List suppliers (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
        post: {
          tags: ["Suppliers"],
          summary: "Create supplier profile (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
      },
      "/api/suppliers/{id}": {
        get: {
          tags: ["Suppliers"],
          summary: "Get supplier profile (planned)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { "501": { description: "Not implemented" } },
        },
        patch: {
          tags: ["Suppliers"],
          summary: "Update supplier profile (planned)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { "501": { description: "Not implemented" } },
        },
      },

      "/api/rfqs": {
        get: {
          tags: ["RFQ"],
          summary: "List RFQs (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
        post: {
          tags: ["RFQ"],
          summary: "Create RFQ (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
      },
      "/api/rfqs/{id}": {
        get: {
          tags: ["RFQ"],
          summary: "Get RFQ details (planned)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { "501": { description: "Not implemented" } },
        },
        patch: {
          tags: ["RFQ"],
          summary: "Update RFQ (planned)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { "501": { description: "Not implemented" } },
        },
      },
      "/api/rfqs/{id}/items": {
        post: {
          tags: ["RFQ"],
          summary: "Add RFQ item (planned)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { "501": { description: "Not implemented" } },
        },
      },

      "/api/orders": {
        get: {
          tags: ["Orders"],
          summary: "List orders (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
        post: {
          tags: ["Orders"],
          summary: "Create order (planned)",
          responses: { "501": { description: "Not implemented" } },
        },
      },
      "/api/orders/{id}": {
        get: {
          tags: ["Orders"],
          summary: "Get order details (planned)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { "501": { description: "Not implemented" } },
        },
        patch: {
          tags: ["Orders"],
          summary: "Update order status (planned)",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { "501": { description: "Not implemented" } },
        },
      },
    },
  },
  apis: [],
});
