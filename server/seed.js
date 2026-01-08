const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'bookDB';

async function seedDatabase() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);

  try {
    // Clear existing collections
    await db.collection('Authors').deleteMany({});
    await db.collection('Genres').deleteMany({});
    await db.collection('Books').deleteMany({});

    console.log('Cleared existing data...');

    // Insert Authors
    const authors = [
      {
        name: 'J.K. Rowling',
        bio: 'British author, best known for Harry Potter series.',
        birth_date: '1965-07-31',
        letterboxd_url: 'https://letterboxd.com/jkrowling',
        created_at: new Date(),
      },
      {
        name: 'George R.R. Martin',
        bio: 'American novelist and short-story writer, best known for A Song of Ice and Fire.',
        birth_date: '1948-09-20',
        letterboxd_url: 'https://letterboxd.com/grrmartin',
        created_at: new Date(),
      },
      {
        name: 'Stephen King',
        bio: 'American author of horror, supernatural fiction, suspense, and fantasy novels.',
        birth_date: '1947-09-21',
        letterboxd_url: 'https://letterboxd.com/stephenking',
        created_at: new Date(),
      },
    ];

    const authorResult = await db.collection('Authors').insertMany(authors);
    console.log(`Inserted ${authorResult.insertedCount} authors`);

    const authorIds = Object.values(authorResult.insertedIds);

    // Insert Genres
    const genres = [
      {
        name: 'Fantasy',
        description: 'A genre of speculative fiction involving magical elements.',
        created_at: new Date(),
      },
      {
        name: 'Horror',
        description: 'Fiction intended to scare, unsettle, or horrify the reader.',
        created_at: new Date(),
      },
      {
        name: 'Science Fiction',
        description: 'Fiction based on imagined future scientific or technological advances.',
        created_at: new Date(),
      },
      {
        name: 'Mystery',
        description: 'A genre of fiction that follows a crime from its commission to its solution.',
        created_at: new Date(),
      },
      {
        name: 'Thriller',
        description: 'A genre of fiction that uses suspense, tension, and excitement as its main elements.',
        created_at: new Date(),
      },
    ];

    const genreResult = await db.collection('Genres').insertMany(genres);
    console.log(`Inserted ${genreResult.insertedCount} genres`);

    const genreIds = Object.values(genreResult.insertedIds);

    // Insert Books
    const books = [
      {
        title: "Harry Potter and the Sorcerer's Stone",
        author_id: authorIds[0],
        synopsis: 'A young wizard discovers his magical heritage on his 11th birthday when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.',
        publish_date: new Date('1997-06-26'),
        genre_ids: [genreIds[0]],
        created_at: new Date(),
      },
      {
        title: 'Harry Potter and the Chamber of Secrets',
        author_id: authorIds[0],
        synopsis: 'The second year at Hogwarts School of Witchcraft and Wizardry brings new challenges and mysteries.',
        publish_date: new Date('1998-07-02'),
        genre_ids: [genreIds[0]],
        created_at: new Date(),
      },
      {
        title: 'A Game of Thrones',
        author_id: authorIds[1],
        synopsis: 'In a land where summers can last decades and winters a lifetime, trouble is brewing.',
        publish_date: new Date('1996-08-01'),
        genre_ids: [genreIds[0], genreIds[2]],
        created_at: new Date(),
      },
      {
        title: 'The Shining',
        author_id: authorIds[2],
        synopsis: 'A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.',
        publish_date: new Date('1977-01-28'),
        genre_ids: [genreIds[1], genreIds[4]],
        created_at: new Date(),
      },
      {
        title: 'It',
        author_id: authorIds[2],
        synopsis: 'Seven young outcasts in Derry, Maine, are about to face their worst nightmare.',
        publish_date: new Date('1986-09-15'),
        genre_ids: [genreIds[1], genreIds[4]],
        created_at: new Date(),
      },
    ];

    const bookResult = await db.collection('Books').insertMany(books);
    console.log(`Inserted ${bookResult.insertedCount} books`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nAuthors: ${authorResult.insertedCount}`);
    console.log(`Genres: ${genreResult.insertedCount}`);
    console.log(`Books: ${bookResult.insertedCount}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();

