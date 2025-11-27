/**
 * Swagger Configuration
 *
 * OpenAPI 3.0 specification configuration for Sprint UI API.
 * Uses next-swagger-doc to generate docs from JSDoc annotations.
 */

import { createSwaggerSpec } from 'next-swagger-doc';

/**
 * Get the OpenAPI specification for the API.
 * Scans app/api folder for @swagger JSDoc annotations.
 */
export function getApiDocs() {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Sprint UI API',
        version: '1.0.0',
        description: `
API for Sprint UI - a biweekly design challenge platform.

## Overview
Sprint UI is a platform where designers receive prompts, submit designs,
and vote/provide anonymous feedback on each other's work.

## Authentication
Most endpoints require authentication via Bearer token.
Obtain a token by calling POST /api/v1/auth/login.

## Rate Limiting
API calls are rate-limited to 100 requests per minute per user.
        `.trim(),
        contact: {
          name: 'Sprint UI Team',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      tags: [
        {
          name: 'Health',
          description: 'API health check endpoints',
        },
        {
          name: 'Authentication',
          description: 'User authentication and session management',
        },
        {
          name: 'Challenges',
          description: 'Design challenge management',
        },
        {
          name: 'Sprints',
          description: 'Biweekly sprint management',
        },
        {
          name: 'Participants',
          description: 'Sprint participant management',
        },
        {
          name: 'Submissions',
          description: 'Design submission management',
        },
        {
          name: 'Assets',
          description: 'Submission asset management',
        },
        {
          name: 'Votes',
          description: 'Voting on submissions',
        },
        {
          name: 'Feedback',
          description: 'Feedback on submissions',
        },
        {
          name: 'Skills',
          description: 'Design skill definitions and progress',
        },
        {
          name: 'Badges',
          description: 'Achievement badge management',
        },
        {
          name: 'XP',
          description: 'Experience points and leaderboards',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'PocketBase authentication token',
          },
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                    example: 'NOT_FOUND',
                  },
                  message: {
                    type: 'string',
                    example: 'Resource not found',
                  },
                  details: {
                    type: 'object',
                    nullable: true,
                  },
                  status: {
                    type: 'integer',
                    example: 404,
                  },
                },
                required: ['code', 'message', 'status'],
              },
            },
          },
          PaginatedResponse: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {},
              },
              page: {
                type: 'integer',
                example: 1,
              },
              perPage: {
                type: 'integer',
                example: 20,
              },
              totalItems: {
                type: 'integer',
                example: 100,
              },
              totalPages: {
                type: 'integer',
                example: 5,
              },
            },
          },
          HealthStatus: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                enum: ['ok', 'degraded'],
                example: 'ok',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
              },
              version: {
                type: 'string',
                example: '1.0.0',
              },
              services: {
                type: 'object',
                properties: {
                  pocketbase: {
                    type: 'string',
                    enum: ['connected', 'disconnected'],
                    example: 'connected',
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return spec;
}
