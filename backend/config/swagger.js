const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Productivity Dashboard API',
      version: '1.0.0',
      description: 'A comprehensive API for managing personal productivity including notes, todos, reminders, bookmarks, quotes, timers, and text utilities.',
      contact: {
        name: 'Personal Productivity Dashboard',
        url: process.env.API_BASE_URL
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL,
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Note: {
          type: 'object',
          required: ['id', 'title', 'content'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the note'
            },
            title: {
              type: 'string',
              description: 'Title of the note'
            },
            content: {
              type: 'string',
              description: 'Content of the note'
            },
            category: {
              type: 'string',
              description: 'Category of the note',
              default: 'general'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Tags associated with the note'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the note was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the note was last updated'
            }
          }
        },
        Todo: {
          type: 'object',
          required: ['id', 'title'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the todo'
            },
            title: {
              type: 'string',
              description: 'Title of the todo'
            },
            description: {
              type: 'string',
              description: 'Description of the todo'
            },
            completed: {
              type: 'boolean',
              description: 'Whether the todo is completed',
              default: false
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Priority level of the todo',
              default: 'medium'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Due date for the todo'
            },
            category: {
              type: 'string',
              description: 'Category of the todo',
              default: 'general'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the todo was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the todo was last updated'
            }
          }
        },
        Reminder: {
          type: 'object',
          required: ['id', 'title', 'dateTime'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the reminder'
            },
            title: {
              type: 'string',
              description: 'Title of the reminder'
            },
            description: {
              type: 'string',
              description: 'Description of the reminder'
            },
            dateTime: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time for the reminder'
            },
            recurring: {
              type: 'string',
              enum: ['none', 'daily', 'weekly', 'monthly'],
              description: 'Recurring pattern for the reminder',
              default: 'none'
            },
            active: {
              type: 'boolean',
              description: 'Whether the reminder is active',
              default: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the reminder was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the reminder was last updated'
            }
          }
        },
        Bookmark: {
          type: 'object',
          required: ['id', 'title', 'url'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the bookmark'
            },
            title: {
              type: 'string',
              description: 'Title of the bookmark'
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'URL of the bookmark'
            },
            description: {
              type: 'string',
              description: 'Description of the bookmark'
            },
            category: {
              type: 'string',
              description: 'Category of the bookmark',
              default: 'general'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Tags associated with the bookmark'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the bookmark was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the bookmark was last updated'
            }
          }
        },
        Quote: {
          type: 'object',
          required: ['id', 'text', 'author'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the quote'
            },
            text: {
              type: 'string',
              description: 'Text content of the quote'
            },
            author: {
              type: 'string',
              description: 'Author of the quote'
            },
            category: {
              type: 'string',
              description: 'Category of the quote',
              default: 'general'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the quote was created'
            }
          }
        },
        Timer: {
          type: 'object',
          required: ['id', 'duration', 'type'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the timer'
            },
            title: {
              type: 'string',
              description: 'Title of the timer session'
            },
            duration: {
              type: 'number',
              description: 'Duration of the timer in seconds'
            },
            type: {
              type: 'string',
              enum: ['work', 'break', 'custom'],
              description: 'Type of timer session',
              default: 'work'
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'Start time of the timer'
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              description: 'End time of the timer'
            },
            status: {
              type: 'string',
              enum: ['running', 'stopped', 'paused'],
              description: 'Current status of the timer'
            },
            stoppedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the timer was stopped'
            }
          }
        },
        Error: {
          type: 'object',
          required: ['error'],
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Stats: {
          type: 'object',
          properties: {
            notes: {
              type: 'object',
              properties: {
                total: {
                  type: 'number',
                  description: 'Total number of notes'
                }
              }
            },
            todos: {
              type: 'object',
              properties: {
                total: {
                  type: 'number',
                  description: 'Total number of todos'
                },
                completed: {
                  type: 'number',
                  description: 'Number of completed todos'
                }
              }
            },
            reminders: {
              type: 'object',
              properties: {
                total: {
                  type: 'number',
                  description: 'Total number of reminders'
                }
              }
            },
            bookmarks: {
              type: 'object',
              properties: {
                total: {
                  type: 'number',
                  description: 'Total number of bookmarks'
                }
              }
            },
            quotes: {
              type: 'object',
              properties: {
                total: {
                  type: 'number',
                  description: 'Total number of quotes'
                }
              }
            },
            timers: {
              type: 'object',
              properties: {
                total: {
                  type: 'number',
                  description: 'Total number of timers'
                }
              }
            }
          }
        },
        MemoryUsage: {
          type: 'object',
          properties: {
            rss: {
              type: 'string',
              description: 'Resident set size in MB'
            },
            heapTotal: {
              type: 'string',
              description: 'Total heap size in MB'
            },
            heapUsed: {
              type: 'string',
              description: 'Used heap size in MB'
            },
            external: {
              type: 'string',
              description: 'External memory usage in MB'
            }
          }
        },
        Uptime: {
          type: 'object',
          properties: {
            uptime: {
              type: 'string',
              description: 'Human readable uptime'
            },
            uptimeSeconds: {
              type: 'number',
              description: 'Uptime in seconds'
            }
          }
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'unhealthy'],
              description: 'Health status of the server'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of health check'
            },
            uptime: {
              type: 'number',
              description: 'Server uptime in seconds'
            }
          }
        }
      }
    }
  },
  apis: [
    './routes/*.js'
  ]
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = specs;
