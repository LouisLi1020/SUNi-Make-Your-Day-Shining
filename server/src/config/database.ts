import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/suni-dev';
    
    const options = {
      // Connection options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      
      // Write concern options
      writeConcern: {
        w: 'majority' as const,
        j: true,
        wtimeout: 1000
      },
      
      // Read preference
      readPreference: 'primary' as any,
      
      // Authentication
      authSource: 'admin',
      
      // SSL/TLS options (for production)
      ...(process.env.NODE_ENV === 'production' && {
        ssl: true,
        sslValidate: true
      })
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB connected successfully`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`🔗 Connection state: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔒 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      // Ping the database
      await mongoose.connection.db.admin().ping();
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
};

// Get database statistics
export const getDatabaseStats = async () => {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      throw new Error('Database not connected');
    }

    const stats = await mongoose.connection.db.stats();
    return {
      database: mongoose.connection.name,
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      objects: stats.objects,
      avgObjSize: stats.avgObjSize
    };
  } catch (error) {
    console.error('❌ Error getting database stats:', error);
    throw error;
  }
};

// Create database indexes
export const createIndexes = async (): Promise<void> => {
  try {
    console.log('🔍 Creating database indexes...');
    
    // Import models to ensure they're registered
    await import('../models');
    
    // Create indexes for all models
    await mongoose.connection.syncIndexes();
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating database indexes:', error);
    throw error;
  }
};

// Seed initial data
export const seedInitialData = async (): Promise<void> => {
  try {
    console.log('🌱 Seeding initial data...');
    
    // Import models
    const { User, UserRole } = await import('../models');
    
    // Check if admin user exists
    const adminExists = await User.findOne({ role: UserRole.ADMIN });
    
    if (!adminExists) {
      // Create default admin user
      const adminUser = new User({
        email: 'admin@suni.com',
        name: 'Suni Admin',
        password: 'admin123456', // This will be hashed by the pre-save middleware
        role: UserRole.ADMIN,
        isEmailVerified: true,
        isActive: true,
        preferences: {
          language: 'en',
          currency: 'USD',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          marketing: false
        }
      });
      
      await adminUser.save();
      console.log('✅ Default admin user created');
    }
    
    console.log('✅ Initial data seeding completed');
  } catch (error) {
    console.error('❌ Error seeding initial data:', error);
    throw error;
  }
};

export default connectDB;
