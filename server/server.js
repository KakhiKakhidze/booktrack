const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://booktrack:booktrak112358@cluster0.uzevy1s.mongodb.net/';
const DB_NAME = process.env.DB_NAME || 'bookDB';

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    db = client.db(DB_NAME);
    console.log(`Connected to MongoDB: ${DB_NAME}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Initialize database connection
connectDB();

// ==================== AUTHORS ENDPOINTS ====================

// Get all authors
app.get('/api/authors', async (req, res) => {
  try {
    const authors = await db.collection('Authors').find({}).toArray();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get author by ID
app.get('/api/authors/:id', async (req, res) => {
  try {
    const author = await db.collection('Authors').findOne({
      _id: new ObjectId(req.params.id)
    });
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create author
app.post('/api/authors', async (req, res) => {
  try {
    const author = {
      ...req.body,
      created_at: new Date()
    };
    const result = await db.collection('Authors').insertOne(author);
    res.status(201).json({ _id: result.insertedId, ...author });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GENRES ENDPOINTS ====================

// Get all genres
app.get('/api/genres', async (req, res) => {
  try {
    const genres = await db.collection('Genres').find({}).toArray();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get genre by ID
app.get('/api/genres/:id', async (req, res) => {
  try {
    const genre = await db.collection('Genres').findOne({
      _id: new ObjectId(req.params.id)
    });
    if (!genre) {
      return res.status(404).json({ error: 'Genre not found' });
    }
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create genre
app.post('/api/genres', async (req, res) => {
  try {
    const genre = {
      ...req.body,
      created_at: new Date()
    };
    const result = await db.collection('Genres').insertOne(genre);
    res.status(201).json({ _id: result.insertedId, ...genre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BOOKS ENDPOINTS ====================

// Get all books with authors and genres (using aggregation with cursor)
app.get('/api/books', async (req, res) => {
  try {
    const { author_id, genre_id, limit, skip } = req.query;
    
    // Build match stage
    const matchStage = {};
    if (author_id) {
      matchStage.author_id = new ObjectId(author_id);
    }
    if (genre_id) {
      matchStage.genre_ids = new ObjectId(genre_id);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'Authors',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $lookup: {
          from: 'Genres',
          localField: 'genre_ids',
          foreignField: '_id',
          as: 'genres'
        }
      },
      { $unwind: '$author' }
    ];

    if (skip) {
      pipeline.push({ $skip: parseInt(skip) });
    }
    if (limit) {
      pipeline.push({ $limit: parseInt(limit) });
    }

    const cursor = db.collection('Books').aggregate(pipeline);
    const books = await cursor.toArray();
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get books using cursor (for large datasets)
app.get('/api/books/cursor', async (req, res) => {
  try {
    const { author_id, genre_id } = req.query;
    
    const matchStage = {};
    if (author_id) {
      matchStage.author_id = new ObjectId(author_id);
    }
    if (genre_id) {
      matchStage.genre_ids = new ObjectId(genre_id);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'Authors',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $lookup: {
          from: 'Genres',
          localField: 'genre_ids',
          foreignField: '_id',
          as: 'genres'
        }
      },
      { $unwind: '$author' }
    ];

    const cursor = db.collection('Books').aggregate(pipeline);
    const books = [];
    
    while (await cursor.hasNext()) {
      const book = await cursor.next();
      books.push(book);
    }
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const pipeline = [
      { $match: { _id: new ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'Authors',
          localField: 'author_id',
          foreignField: '_id',
          as: 'author'
        }
      },
      {
        $lookup: {
          from: 'Genres',
          localField: 'genre_ids',
          foreignField: '_id',
          as: 'genres'
        }
      },
      { $unwind: '$author' }
    ];

    const cursor = db.collection('Books').aggregate(pipeline);
    const books = await cursor.toArray();
    
    if (books.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(books[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create book
app.post('/api/books', async (req, res) => {
  try {
    const book = {
      ...req.body,
      author_id: new ObjectId(req.body.author_id),
      genre_ids: req.body.genre_ids.map(id => new ObjectId(id)),
      created_at: new Date()
    };
    const result = await db.collection('Books').insertOne(book);
    res.status(201).json({ _id: result.insertedId, ...book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: db ? 'connected' : 'disconnected' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${DB_NAME}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.log(`\nThe server is likely already running.`);
    console.log(`To stop it, find the process using: netstat -ano | findstr :${PORT}`);
    console.log(`Then kill it with: taskkill /PID <PID> /F\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

