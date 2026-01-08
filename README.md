# BookTrack - React Native App with MongoDB Backend

A React Native Expo app for tracking books with MongoDB backend integration.

## Project Structure

```
booktrack/
├── server/              # Backend API server
│   ├── server.js       # Express server with MongoDB
│   ├── seed.js         # Database seeding script
│   └── package.json    # Backend dependencies
├── screens/            # React Native screens
│   ├── MainPage.js     # Displays all books
│   ├── SearchPage.js   # Search and filter books
│   ├── AddReview.js    # Add book reviews
│   ├── Activity.js     # User activity
│   └── Profile.js      # User profile
├── services/           # API service layer
│   └── api.js          # API client for backend
└── App.js              # Main app with navigation

```

## MongoDB Schema

### Authors Collection
```javascript
{
  "_id": ObjectId(),
  "name": "J.K. Rowling",
  "bio": "British author, best known for Harry Potter series.",
  "birth_date": "1965-07-31",
  "letterboxd_url": "https://letterboxd.com/author_profile",
  "created_at": ISODate()
}
```

### Genres Collection
```javascript
{
  "_id": ObjectId(),
  "name": "Fantasy",
  "description": "A genre of speculative fiction involving magical elements.",
  "created_at": ISODate()
}
```

### Books Collection
```javascript
{
  "_id": ObjectId(),
  "title": "Harry Potter and the Sorcerer's Stone",
  "author_id": ObjectId("..."),  // reference to Authors._id
  "synopsis": "A young wizard discovers his magical heritage...",
  "publish_date": ISODate("1997-06-26"),
  "genre_ids": [
    ObjectId("..."),  // reference to Genres._id
    ObjectId("...")
  ],
  "created_at": ISODate()
}
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=bookDB
```

4. Make sure MongoDB is running on your system

5. Seed the database with sample data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The API will be available at `http://localhost:3000`

### 2. Frontend Setup

1. Install dependencies (if not already installed):
```bash
npm install
```

2. Configure API URL for mobile devices:
   - Open `services/api.js`
   - For Android/iOS devices, replace `localhost` with your computer's IP address
   - Find your IP: 
     - Windows: `ipconfig` (look for IPv4 Address)
     - Mac/Linux: `ifconfig` or `ip addr`
   - Example: `http://192.168.1.100:3000/api`

3. Start the Expo development server:
```bash
npm start
```

4. Open the app:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your phone
   - Press `w` for web browser

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

## Features

- ✅ Bottom tab navigation with 5 screens
- ✅ MongoDB integration with aggregation queries
- ✅ Book listing with author and genre information
- ✅ Search functionality
- ✅ Filter by author and genre
- ✅ Pull-to-refresh
- ✅ Responsive UI design

## Technologies Used

- **Frontend**: React Native, Expo SDK 54, React Navigation
- **Backend**: Node.js, Express.js, MongoDB
- **State Management**: React Hooks

## Notes

- For mobile devices, make sure your phone and computer are on the same network
- The backend server must be running for the app to fetch data
- MongoDB must be installed and running locally or use MongoDB Atlas

