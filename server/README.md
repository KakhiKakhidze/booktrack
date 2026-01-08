# BookTrack Backend API

Express.js server with MongoDB integration for the BookTrack app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=bookDB
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## API Endpoints

### Authors
- `GET /api/authors` - Get all authors
- `GET /api/authors/:id` - Get author by ID
- `POST /api/authors` - Create new author

### Genres
- `GET /api/genres` - Get all genres
- `GET /api/genres/:id` - Get genre by ID
- `POST /api/genres` - Create new genre

### Books
- `GET /api/books` - Get all books with populated author and genres
- `GET /api/books/cursor` - Get books using cursor (for large datasets)
- `GET /api/books/:id` - Get book by ID with populated data
- `POST /api/books` - Create new book

### Query Parameters for Books
- `author_id` - Filter by author
- `genre_id` - Filter by genre
- `limit` - Limit number of results
- `skip` - Skip number of results (for pagination)

## Example Usage

```javascript
// Get all books
fetch('http://localhost:3000/api/books')

// Get books by author
fetch('http://localhost:3000/api/books?author_id=507f1f77bcf86cd799439011')

// Get books with pagination
fetch('http://localhost:3000/api/books?limit=10&skip=0')
```

