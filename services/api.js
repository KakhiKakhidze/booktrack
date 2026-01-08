// For React Native, use your computer's IP address instead of localhost
// Find your IP: Windows: ipconfig | Linux/Mac: ifconfig
// Example: 'http://192.168.1.100:3000/api'
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development (works for web)
  // ? 'http://192.168.1.XXX:3000/api'  // Use your computer's IP for mobile devices
  : 'https://your-api-domain.com/api';  // Production

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ==================== AUTHORS ====================
  async getAuthors() {
    return this.request('/authors');
  }

  async getAuthorById(id) {
    return this.request(`/authors/${id}`);
  }

  async createAuthor(authorData) {
    return this.request('/authors', {
      method: 'POST',
      body: JSON.stringify(authorData),
    });
  }

  // ==================== GENRES ====================
  async getGenres() {
    return this.request('/genres');
  }

  async getGenreById(id) {
    return this.request(`/genres/${id}`);
  }

  async createGenre(genreData) {
    return this.request('/genres', {
      method: 'POST',
      body: JSON.stringify(genreData),
    });
  }

  // ==================== BOOKS ====================
  async getBooks(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.author_id) queryParams.append('author_id', filters.author_id);
    if (filters.genre_id) queryParams.append('genre_id', filters.genre_id);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.skip) queryParams.append('skip', filters.skip.toString());

    const queryString = queryParams.toString();
    const endpoint = `/books${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getBooksWithCursor(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.author_id) queryParams.append('author_id', filters.author_id);
    if (filters.genre_id) queryParams.append('genre_id', filters.genre_id);

    const queryString = queryParams.toString();
    const endpoint = `/books/cursor${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getBookById(id) {
    return this.request(`/books/${id}`);
  }

  async createBook(bookData) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();

