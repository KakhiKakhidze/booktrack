import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import ApiService from '../services/api';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2 || selectedAuthor || selectedGenre) {
      searchBooks();
    } else {
      setBooks([]);
    }
  }, [searchQuery, selectedAuthor, selectedGenre]);

  const loadInitialData = async () => {
    try {
      const [authorsData, genresData] = await Promise.all([
        ApiService.getAuthors(),
        ApiService.getGenres(),
      ]);
      setAuthors(authorsData);
      setGenres(genresData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const searchBooks = async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (selectedAuthor) {
        filters.author_id = selectedAuthor;
      }
      if (selectedGenre) {
        filters.genre_id = selectedGenre;
      }

      const data = await ApiService.getBooks(filters);
      
      // Filter by search query if provided
      let filteredData = data;
      if (searchQuery.length > 2) {
        filteredData = data.filter(
          (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.synopsis?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setBooks(filteredData);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookCard}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>by {item.author?.name || 'Unknown Author'}</Text>
      {item.genres && item.genres.length > 0 && (
        <View style={styles.genresContainer}>
          {item.genres.map((genre, index) => (
            <Text key={index} style={styles.genreTag}>
              {genre.name}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books, authors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Filter by:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedAuthor === null && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedAuthor(null)}
          >
            <Text style={styles.filterButtonText}>All Authors</Text>
          </TouchableOpacity>
          {authors.slice(0, 5).map((author) => (
            <TouchableOpacity
              key={author._id.toString()}
              style={[
                styles.filterButton,
                selectedAuthor === author._id.toString() && styles.filterButtonActive,
              ]}
              onPress={() =>
                setSelectedAuthor(
                  selectedAuthor === author._id.toString() ? null : author._id.toString()
                )
              }
            >
              <Text style={styles.filterButtonText}>{author.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedGenre === null && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedGenre(null)}
          >
            <Text style={styles.filterButtonText}>All Genres</Text>
          </TouchableOpacity>
          {genres.slice(0, 5).map((genre) => (
            <TouchableOpacity
              key={genre._id.toString()}
              style={[
                styles.filterButton,
                selectedGenre === genre._id.toString() && styles.filterButtonActive,
              ]}
              onPress={() =>
                setSelectedGenre(
                  selectedGenre === genre._id.toString() ? null : genre._id.toString()
                )
              }
            >
              <Text style={styles.filterButtonText}>{genre.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery.length > 2 || selectedAuthor || selectedGenre
                  ? 'No books found'
                  : 'Start typing to search or select filters'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#666',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  bookCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    marginRight: 5,
    marginBottom: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});


