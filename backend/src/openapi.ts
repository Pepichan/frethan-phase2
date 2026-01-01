export const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Frethan API",
    version: "1.0.0",
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string" },
        },
        required: ["status", "message"],
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "integer" },
          buyerId: { type: "integer" },
          supplierId: { type: "integer" },
          quoteId: { type: "integer" },
          status: {
            type: "string",
            enum: ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
          },
          totalAmount: { type: "string", example: "123.45" },
          currency: { type: "string", example: "AUD" },
        },
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          orderId: { type: ["integer", "null"] },
          type: { type: "string" },
          message: { type: "string" },
          isRead: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/orders": {
      post: {
        summary: "Create order (Buyer/Admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { quoteId: { type: "integer" } },
                required: ["quoteId"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Created",
          },
          "400": { description: "Bad request", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          "403": { description: "Forbidden", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/orders/{id}": {
      get: {
        summary: "Get order by id (Buyer/Supplier/Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Not found" },
        },
      },
      put: {
        summary: "Update order (Supplier status update / Admin update)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
                  },
                  totalAmount: { type: ["string", "number"] },
                  currency: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "OK" },
          "400": { description: "Bad request" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Not found" },
        },
      },
      delete: {
        summary: "Delete order (Admin or Buyer if PENDING)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "204": { description: "No content" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden" },
          "404": { description: "Not found" },
        },
      },
    },
    "/notifications": {
      get: {
        summary: "List notifications for current user",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100 } }],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/notifications/{id}/read": {
      patch: {
        summary: "Mark notification as read",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
          "404": { description: "Not found" },
        },
      },
    },
    "/openapi.json": {
      get: {
        summary: "OpenAPI spec",
        responses: { "200": { description: "OK" } },
      },
    },
  },
} as const;
