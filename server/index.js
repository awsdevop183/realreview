// Server implementation for RealReview API
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// PostgreSQL Connection (Docker implementation)
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'realreview',
});

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// JWT Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

// Init database tables
const initDb = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Properties table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id),
        approved BOOLEAN DEFAULT FALSE,
        archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Images table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id),
        url VARCHAR(255) NOT NULL,
        s3_key VARCHAR(255) NOT NULL,
        location_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id),
        user_id INTEGER REFERENCES users(id),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables initialized');
    
    // Create an admin user if it doesn't exist
    const adminEmail = 'admin@realreview.com';
    const adminExists = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin User', adminEmail, hashedPassword, 'admin']
      );
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Location validation function (simplified for demo)
const validateImageLocation = async (imageBuffer, claimedLocation) => {
  // In a real implementation, this would use image metadata extraction
  // and possibly map APIs to verify location
  // For demo purposes, we'll just mock a successful validation
  
  return {
    verified: true,
    confidence: 0.85,
    actualLocation: claimedLocation
  };
};

// Archive old images (scheduled job)
const archiveOldImages = async () => {
  try {
    const thresholdDate = new Date();
    thresholdDate.setMonth(thresholdDate.getMonth() - 6); // Archive images older than 6 months
    
    await pool.query(
      'UPDATE properties SET archived = TRUE WHERE created_at < $1 AND archived = FALSE',
      [thresholdDate]
    );
    
    console.log('Old images archived successfully');
  } catch (error) {
    console.error('Error archiving old images:', error);
  }
};

// Set up a job to run archiving every day
// In production, use a proper scheduler like node-cron
setInterval(archiveOldImages, 24 * 60 * 60 * 1000); // Once every 24 hours

// API Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );
    
    const user = result.rows[0];
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    }
  });
});

// Property routes
app.post('/api/properties', authenticateToken, upload.array('images', 10), async (req, res) => {
  const { title, description, location } = req.body;
  const files = req.files;
  
  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create property
    const propertyResult = await client.query(
      'INSERT INTO properties (title, description, location, user_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, description, location, req.user.id]
    );
    
    const propertyId = propertyResult.rows[0].id;
    
    // Process and upload each image
    for (const file of files) {
      // Validate location from image metadata
      const locationValidation = await validateImageLocation(file.buffer, location);
      
      // Generate unique key for S3
      const s3Key = `properties/${propertyId}/${uuidv4()}-${file.originalname}`;
      
      // Upload to S3
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME || 'realreview-images',
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };
      
      const s3Result = await s3.upload(uploadParams).promise();
      
      // Save image record
      await client.query(
        'INSERT INTO images (property_id, url, s3_key, location_verified) VALUES ($1, $2, $3, $4)',
        [propertyId, s3Result.Location, s3Key, locationValidation.verified]
      );
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: 'Property uploaded successfully and pending approval',
      id: propertyId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Property upload error:', error);
    res.status(500).json({ message: 'Server error during property upload' });
  } finally {
    client.release();
  }
});

app.get('/api/properties', async (req, res) => {
  try {
    const { search, location, sort, archived } = req.query;
    let query = `
      SELECT p.id, p.title, p.description, p.location, p.approved, p.created_at,
             u.name as uploader_name,
             (SELECT COUNT(*) FROM reviews r WHERE r.property_id = p.id) as review_count,
             (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.property_id = p.id) as avg_rating,
             (SELECT i.url FROM images i WHERE i.property_id = p.id LIMIT 1) as image_url
      FROM properties p
      JOIN users u ON p.user_id = u.id
      WHERE p.approved = TRUE AND p.archived = $1
    `;
    
    const queryParams = [archived === 'true'];
    let paramIndex = 2;
    
    if (search) {
      query += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.location ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    if (location && location !== 'all') {
      query += ` AND p.location ILIKE $${paramIndex}`;
      queryParams.push(`%${location}%`);
      paramIndex++;
    }
    
    // Add sorting
    if (sort === 'rating') {
      query += ' ORDER BY avg_rating DESC';
    } else if (sort === 'popular') {
      query += ' ORDER BY review_count DESC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }
    
    const result = await pool.query(query, queryParams);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error fetching properties' });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get property details
    const propertyResult = await pool.query(`
      SELECT p.id, p.title, p.description, p.location, p.approved, p.created_at,
             u.id as uploader_id, u.name as uploader_name,
             (SELECT COUNT(*) FROM reviews r WHERE r.property_id = p.id) as review_count,
             (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.property_id = p.id) as avg_rating
      FROM properties p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [id]);
    
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const property = propertyResult.rows[0];
    
    // Get property images
    const imagesResult = await pool.query(
      'SELECT id, url FROM images WHERE property_id = $1',
      [id]
    );
    
    // Combine property with images
    const propertyWithImages = {
      ...property,
      images: imagesResult.rows.map(img => img.url)
    };
    
    res.json(propertyWithImages);
  } catch (error) {
    console.error('Error fetching property details:', error);
    res.status(500).json({ message: 'Server error fetching property details' });
  }
});

// Review routes
app.post('/api/properties/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    // Check if property exists and is approved
    const propertyResult = await pool.query(
      'SELECT * FROM properties WHERE id = $1 AND approved = TRUE',
      [id]
    );
    
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Property not found or not approved' });
    }
    
    // Check if user has already reviewed this property
    const existingReview = await pool.query(
      'SELECT * FROM reviews WHERE property_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (existingReview.rows.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this property' });
    }
    
    // Add the review
    const reviewResult = await pool.query(
      'INSERT INTO reviews (property_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, req.user.id, rating, comment]
    );
    
    // Get user info
    const userResult = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [req.user.id]
    );
    
    const review = {
      ...reviewResult.rows[0],
      userName: userResult.rows[0].name
    };
    
    res.status(201).json({
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

app.get('/api/properties/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, 
             r.user_id, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.property_id = $1
      ORDER BY r.created_at DESC
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// Admin routes
app.get('/api/admin/properties/pending', authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.location, p.created_at,
             u.name as uploader_name,
             (SELECT COUNT(*) FROM images i WHERE i.property_id = p.id) as image_count,
             (SELECT i.url FROM images i WHERE i.property_id = p.id LIMIT 1) as preview_image
      FROM properties p
      JOIN users u ON p.user_id = u.id
      WHERE p.approved = FALSE AND p.archived = FALSE
      ORDER BY p.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pending properties:', error);
    res.status(500).json({ message: 'Server error fetching pending properties' });
  }
});

app.patch('/api/admin/properties/:id/approve', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'UPDATE properties SET approved = TRUE WHERE id = $1',
      [id]
    );
    
    res.json({ message: 'Property approved successfully' });
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({ message: 'Server error approving property' });
  }
});

app.delete('/api/admin/properties/:id', authenticateToken, isAdmin, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get S3 keys for images to delete
    const imagesResult = await client.query(
      'SELECT s3_key FROM images WHERE property_id = $1',
      [req.params.id]
    );
    
    // Delete images from S3
    for (const image of imagesResult.rows) {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME || 'realreview-images',
        Key: image.s3_key
      }).promise();
    }
    
    // Delete reviews
    await client.query('DELETE FROM reviews WHERE property_id = $1', [req.params.id]);
    
    // Delete images from database
    await client.query('DELETE FROM images WHERE property_id = $1', [req.params.id]);
    
    // Delete property
    await client.query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    
    await client.query('COMMIT');
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Server error deleting property' });
  } finally {
    client.release();
  }
});

// Start the server
app.listen(PORT, HOST, async () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  await initDb();
});

export default app;