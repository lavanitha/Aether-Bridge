const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

// In-memory storage for development
const inMemoryStorage = {
  users: new Map(),
  credentials: new Map(),
  courses: new Map(),
  applications: new Map(),
  events: new Map(),
  mentorships: new Map(),
  assessments: new Map(),
  nfts: new Map()
};

// Database configuration
const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aetherbridge',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  postgresql: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'aetherbridge',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

// MongoDB connection
let mongoConnection = null;

// PostgreSQL connection
let sequelize = null;

// Storage mode
let storageMode = 'in-memory'; // Default to in-memory for development

// Initialize database connections
async function initializeDatabase() {
  try {
    console.log('🔌 Initializing database connections...');
    
    // Check if we should use in-memory storage
    if (process.env.USE_IN_MEMORY_STORAGE === 'true' || 
        (!process.env.MONGODB_URI && !process.env.POSTGRES_URI)) {
      storageMode = 'in-memory';
      console.log('💾 Using in-memory storage for development');
      await initializeInMemoryStorage();
      return;
    }
    
    // Initialize MongoDB
    if (process.env.USE_MONGODB !== 'false') {
      try {
        await initializeMongoDB();
        storageMode = 'mongodb';
      } catch (error) {
        console.warn('⚠️ MongoDB connection failed, falling back to in-memory storage');
        storageMode = 'in-memory';
        await initializeInMemoryStorage();
      }
    }
    
    // Initialize PostgreSQL
    if (process.env.USE_POSTGRESQL !== 'false' && storageMode === 'in-memory') {
      try {
        await initializePostgreSQL();
        storageMode = 'postgresql';
      } catch (error) {
        console.warn('⚠️ PostgreSQL connection failed, using in-memory storage');
        storageMode = 'in-memory';
        await initializeInMemoryStorage();
      }
    }
    
    console.log(`✅ Database initialized successfully (Mode: ${storageMode})`);
  } catch (error) {
    console.error('❌ Failed to initialize database connections:', error);
    console.log('🔄 Falling back to in-memory storage');
    storageMode = 'in-memory';
    await initializeInMemoryStorage();
  }
}

// Initialize MongoDB
async function initializeMongoDB() {
  try {
    console.log('📦 Connecting to MongoDB...');
    
    mongoConnection = await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Initialize PostgreSQL
async function initializePostgreSQL() {
  try {
    console.log('🐘 Connecting to PostgreSQL...');
    
    sequelize = new Sequelize(
      config.postgresql.database,
      config.postgresql.username,
      config.postgresql.password,
      {
        host: config.postgresql.host,
        port: config.postgresql.port,
        dialect: config.postgresql.dialect,
        logging: config.postgresql.logging,
        pool: config.postgresql.pool
      }
    );
    
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    // Sync models (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 PostgreSQL models synchronized');
    }
    
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error);
    throw error;
  }
}

// Initialize in-memory storage
async function initializeInMemoryStorage() {
  console.log('💾 Initializing in-memory storage...');
  
  // Seed with some sample data
  const sampleUsers = [
    {
      id: '1',
      email: 'admin@aetherbridge.com',
      password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ',
      name: 'Admin User',
      role: 'admin',
      walletAddress: '0x1234567890123456789012345678901234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      email: 'student@aetherbridge.com',
      password: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ',
      name: 'Student User',
      role: 'student',
      walletAddress: '0x2345678901234567890123456789012345678901',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  const sampleCredentials = [
    {
      id: '1',
      userId: '2',
      credentialId: 'cred_001',
      title: 'Bachelor of Computer Science',
      issuer: 'University of Technology',
      credentialType: 'degree',
      blockchainHash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
      nftTokenId: '1',
      metadata: {
        grade: 'A+',
        graduationYear: 2023,
        major: 'Computer Science'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  const sampleCourses = [
    {
      id: '1',
      title: 'Introduction to Blockchain',
      description: 'Learn the fundamentals of blockchain technology',
      institution: 'University of Technology',
      duration: '12 weeks',
      level: 'Beginner',
      price: 299,
      category: 'Technology',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Advanced AI and Machine Learning',
      description: 'Deep dive into AI and ML concepts',
      institution: 'Tech Institute',
      duration: '16 weeks',
      level: 'Advanced',
      price: 499,
      category: 'Technology',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // Populate in-memory storage
  sampleUsers.forEach(user => inMemoryStorage.users.set(user.id, user));
  sampleCredentials.forEach(cred => inMemoryStorage.credentials.set(cred.id, cred));
  sampleCourses.forEach(course => inMemoryStorage.courses.set(course.id, course));
  
  console.log('✅ In-memory storage initialized with sample data');
}

// Get MongoDB connection
function getMongoConnection() {
  return mongoConnection;
}

// Get PostgreSQL connection
function getPostgreSQLConnection() {
  return sequelize;
}

// Health check
async function healthCheck() {
  const status = {
    mongodb: 'disconnected',
    postgresql: 'disconnected',
    timestamp: new Date().toISOString()
  };
  
  try {
    if (mongoConnection && mongoose.connection.readyState === 1) {
      status.mongodb = 'connected';
    }
  } catch (error) {
    console.error('MongoDB health check failed:', error);
  }
  
  try {
    if (sequelize) {
      await sequelize.authenticate();
      status.postgresql = 'connected';
    }
  } catch (error) {
    console.error('PostgreSQL health check failed:', error);
  }
  
  return status;
}

// Close database connections
async function closeConnections() {
  try {
    console.log('🛑 Closing database connections...');
    
    if (mongoConnection) {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    }
    
    if (sequelize) {
      await sequelize.close();
      console.log('✅ PostgreSQL connection closed');
    }
    
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
    throw error;
  }
}

// Database utilities
const dbUtils = {
  // MongoDB utilities
  mongo: {
    async findOne(collection, query) {
      if (!mongoConnection) throw new Error('MongoDB not connected');
      return await mongoose.connection.db.collection(collection).findOne(query);
    },
    
    async find(collection, query, options = {}) {
      if (!mongoConnection) throw new Error('MongoDB not connected');
      return await mongoose.connection.db.collection(collection).find(query, options).toArray();
    },
    
    async insertOne(collection, document) {
      if (!mongoConnection) throw new Error('MongoDB not connected');
      return await mongoose.connection.db.collection(collection).insertOne(document);
    },
    
    async updateOne(collection, filter, update) {
      if (!mongoConnection) throw new Error('MongoDB not connected');
      return await mongoose.connection.db.collection(collection).updateOne(filter, update);
    },
    
    async deleteOne(collection, filter) {
      if (!mongoConnection) throw new Error('MongoDB not connected');
      return await mongoose.connection.db.collection(collection).deleteOne(filter);
    }
  },
  
  // PostgreSQL utilities
  postgres: {
    async query(sql, params = []) {
      if (!sequelize) throw new Error('PostgreSQL not connected');
      return await sequelize.query(sql, {
        replacements: params,
        type: sequelize.QueryTypes.SELECT
      });
    },
    
    async execute(sql, params = []) {
      if (!sequelize) throw new Error('PostgreSQL not connected');
      return await sequelize.query(sql, {
        replacements: params,
        type: sequelize.QueryTypes.INSERT
      });
    },
    
    async transaction(callback) {
      if (!sequelize) throw new Error('PostgreSQL not connected');
      return await sequelize.transaction(callback);
    }
  },
  
  // In-memory storage utilities
  memory: {
    async findOne(collection, query) {
      const collectionMap = inMemoryStorage[collection];
      if (!collectionMap) throw new Error(`Collection ${collection} not found`);
      
      for (const [id, item] of collectionMap) {
        let match = true;
        for (const [key, value] of Object.entries(query)) {
          if (item[key] !== value) {
            match = false;
            break;
          }
        }
        if (match) return item;
      }
      return null;
    },
    
    async find(collection, query = {}, options = {}) {
      const collectionMap = inMemoryStorage[collection];
      if (!collectionMap) throw new Error(`Collection ${collection} not found`);
      
      let results = Array.from(collectionMap.values());
      
      // Apply query filters
      if (Object.keys(query).length > 0) {
        results = results.filter(item => {
          for (const [key, value] of Object.entries(query)) {
            if (item[key] !== value) return false;
          }
          return true;
        });
      }
      
      // Apply sorting
      if (options.sort) {
        const [field, order] = Object.entries(options.sort)[0];
        results.sort((a, b) => {
          if (order === 1) return a[field] > b[field] ? 1 : -1;
          return a[field] < b[field] ? 1 : -1;
        });
      }
      
      // Apply limit
      if (options.limit) {
        results = results.slice(0, options.limit);
      }
      
      return results;
    },
    
    async insertOne(collection, document) {
      const collectionMap = inMemoryStorage[collection];
      if (!collectionMap) throw new Error(`Collection ${collection} not found`);
      
      const id = document.id || Date.now().toString();
      const item = { ...document, id, createdAt: new Date(), updatedAt: new Date() };
      collectionMap.set(id, item);
      
      return { insertedId: id, ...item };
    },
    
    async updateOne(collection, filter, update) {
      const collectionMap = inMemoryStorage[collection];
      if (!collectionMap) throw new Error(`Collection ${collection} not found`);
      
      for (const [id, item] of collectionMap) {
        let match = true;
        for (const [key, value] of Object.entries(filter)) {
          if (item[key] !== value) {
            match = false;
            break;
          }
        }
        if (match) {
          const updatedItem = { ...item, ...update, updatedAt: new Date() };
          collectionMap.set(id, updatedItem);
          return { modifiedCount: 1, ...updatedItem };
        }
      }
      return { modifiedCount: 0 };
    },
    
    async deleteOne(collection, filter) {
      const collectionMap = inMemoryStorage[collection];
      if (!collectionMap) throw new Error(`Collection ${collection} not found`);
      
      for (const [id, item] of collectionMap) {
        let match = true;
        for (const [key, value] of Object.entries(filter)) {
          if (item[key] !== value) {
            match = false;
            break;
          }
        }
        if (match) {
          collectionMap.delete(id);
          return { deletedCount: 1 };
        }
      }
      return { deletedCount: 0 };
    }
  }
};

module.exports = {
  initializeDatabase,
  getMongoConnection,
  getPostgreSQLConnection,
  healthCheck,
  closeConnections,
  dbUtils,
  storageMode: () => storageMode,
  inMemoryStorage
}; 