const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Tools Manager API',
      version: '1.0.0',
      description: 'API for managing AI tools for software engineering teams',
    },
    components: {
      schemas: {
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            business_size: { type: 'string', enum: ['small', 'medium', 'big'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        CategoryInput: {
          type: 'object',
          required: ['name', 'business_size'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            business_size: { type: 'string', enum: ['small', 'medium', 'big'] },
          },
        },
        AiTool: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
            learning_notes: { type: 'string' },
            youtube_link: { type: 'string' },
            how_to_article: { type: 'string' },
            subscription: { type: 'string', enum: ['free', 'pay-as-you-go'] },
            category_id: { type: 'string', format: 'uuid' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AiToolInput: {
          type: 'object',
          required: ['name', 'subscription'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
            learning_notes: { type: 'string' },
            youtube_link: { type: 'string' },
            how_to_article: { type: 'string' },
            subscription: { type: 'string', enum: ['free', 'pay-as-you-go'] },
            category_id: { type: 'string', format: 'uuid' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./index.js'],
};

module.exports = swaggerJsdoc(options);
