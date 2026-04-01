// Unified Data Store for Movie Ticket Booking System
// This module provides centralized CRUD operations for all data stored in localStorage

import { Movie, Cinema, Showtime, Booking, User, Seat } from '@/types';

// Storage Keys
const STORAGE_KEYS = {
  MOVIES: 'cinemahub_movies',
  CINEMAS: 'cinemahub_cinemas',
  SHOWTIMES: 'cinemahub_showtimes',
  BOOKINGS: 'cinemahub_bookings',
  USERS: 'cinemahub_users',
  COUPONS: 'cinemahub_coupons',
} as const;

// Initial Mock Data - Movies
const initialMovies: Movie[] = [
  {
    id: '1',
    title: 'The Quantum Paradox',
    synopsis: 'A thrilling journey through time and space. When a brilliant physicist discovers a way to manipulate time, she must race against a shadow organization to prevent a catastrophic future.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    language: 'English',
    duration: 148,
    rating: 8.5,
    ageRating: 'PG-13',
    releaseDate: '2024-12-15',
    trailerUrl: 'https://youtube.com/watch?v=example',
    poster: '/sci-fi-movie-poster.png',
    director: 'Sarah Chen',
    cast: ['Emma Watson', 'John Cho', 'Idris Elba'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-01T00:00:00.000Z',
    updatedAt: '2024-12-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Love in Paris',
    synopsis: 'A heartwarming tale of love and discovery. Two strangers meet in the city of lights and find themselves changed forever.',
    genre: ['Romance', 'Drama'],
    language: 'English',
    duration: 125,
    rating: 7.8,
    ageRating: 'PG',
    releaseDate: '2024-12-10',
    poster: '/romantic-movie-poster.png',
    director: 'Pierre Martin',
    cast: ['Sophie Turner', 'Timothée Chalamet'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-05T00:00:00.000Z',
    updatedAt: '2024-12-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Dark Shadows',
    synopsis: 'A suspenseful mystery that will keep you on edge. When a famous actress returns to her childhood home, dark secrets surface.',
    genre: ['Thriller', 'Mystery', 'Horror'],
    language: 'English',
    duration: 135,
    rating: 8.2,
    ageRating: 'R',
    releaseDate: '2024-12-12',
    poster: '/thriller-movie-poster.png',
    director: 'Guillermo del Toro',
    cast: ['Ana de Armas', 'Javier Bardem'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-10T00:00:00.000Z',
    updatedAt: '2024-12-03T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'Laugh Out Loud',
    synopsis: 'Hilarious adventures that will make you laugh. A comedy about a dysfunctional family trying to plan the perfect vacation.',
    genre: ['Comedy', 'Family'],
    language: 'English',
    duration: 110,
    rating: 7.5,
    ageRating: 'PG-13',
    releaseDate: '2024-12-14',
    poster: '/comedy-movie-poster.png',
    director: 'Judd Apatow',
    cast: ['Kristen Wiig', 'Bill Hader'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-15T00:00:00.000Z',
    updatedAt: '2024-12-04T00:00:00.000Z',
  },
  {
    id: '5',
    title: 'Dragon Legends',
    synopsis: 'An epic adventure in a world of magic. A young warrior must unite the kingdom against an ancient evil.',
    genre: ['Fantasy', 'Action', 'Adventure'],
    language: 'English',
    duration: 155,
    rating: 8.7,
    ageRating: 'PG-13',
    releaseDate: '2024-12-16',
    poster: '/fantasy-movie-poster.png',
    director: 'James Cameron',
    cast: ['Henry Cavill', 'Charlize Theron'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-20T00:00:00.000Z',
    updatedAt: '2024-12-05T00:00:00.000Z',
  },
  {
    id: '6',
    title: 'Space Force',
    synopsis: 'Intense action sequences in the final frontier. The first human mission to Mars faces unexpected challenges.',
    genre: ['Action', 'Sci-Fi'],
    language: 'English',
    duration: 140,
    rating: 8.1,
    ageRating: 'PG-13',
    releaseDate: '2024-12-13',
    poster: '/action-movie-poster.png',
    director: 'Christopher Nolan',
    cast: ['Matt Damon', 'Jennifer Lawrence'],
    status: 'now_showing',
    showtimes: [],
    createdAt: '2024-11-25T00:00:00.000Z',
    updatedAt: '2024-12-06T00:00:00.000Z',
  },
];

// Initial Mock Data - Cinemas
const initialCinemas: Cinema[] = [
  {
    id: '1',
    name: 'Legend Cinema - Phnom Penh',
    address: 'Russian Blvd, Phnom Penh',
    city: 'Phnom Penh',
    phone: '+855 23 888 888',
    email: 'info@legend.com',
    image: '/placeholder-cinema.jpg',
    facilities: ['Parking', 'Food Court', 'VIP Lounge', '3D', 'IMAX'],
    screens: [
      { id: '1', cinemaId: '1', name: 'Screen 1', capacity: 150, screenType: 'standard', seatLayout: { rows: [], aislePositions: [] } },
      { id: '2', cinemaId: '1', name: 'Screen 2', capacity: 120, screenType: 'standard', seatLayout: { rows: [], aislePositions: [] } },
      { id: '3', cinemaId: '1', name: 'VIP Screen', capacity: 50, screenType: 'dolby_atmos', seatLayout: { rows: [], aislePositions: [] } },
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'The Mall Cinema',
    address: 'Sihanouk Blvd, Phnom Penh',
    city: 'Phnom Penh',
    phone: '+855 23 999 999',
    email: 'contact@themall.com',
    image: '/placeholder-cinema.jpg',
    facilities: ['Parking', 'Restaurant', '4DX', 'Dolby Atmos'],
    screens: [
      { id: '1', cinemaId: '2', name: 'IMAX Screen', capacity: 200, screenType: 'imax', seatLayout: { rows: [], aislePositions: [] } },
      { id: '2', cinemaId: '2', name: 'Screen 2', capacity: 100, screenType: 'standard', seatLayout: { rows: [], aislePositions: [] } },
    ],
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Aeon Mall Cinema',
    address: 'Monivong Blvd, Phnom Penh',
    city: 'Phnom Penh',
    phone: '+855 23 777 777',
    email: 'support@aeon.com',
    image: '/placeholder-cinema.jpg',
    facilities: ['Parking', 'Shopping', 'VIP', 'IMAX'],
    screens: [
      { id: '1', cinemaId: '3', name: '4DX Screen', capacity: 80, screenType: '4dx', seatLayout: { rows: [], aislePositions: [] } },
      { id: '2', cinemaId: '3', name: 'Dolby Screen', capacity: 120, screenType: 'dolby_atmos', seatLayout: { rows: [], aislePositions: [] } },
      { id: '3', cinemaId: '3', name: 'Screen 3', capacity: 100, screenType: 'standard', seatLayout: { rows: [], aislePositions: [] } },
    ],
    createdAt: '2024-01-03T00:00:00.000Z',
  },
];

// Initial Mock Data - Showtimes
const initialShowtimes: Showtime[] = [
  { id: '1', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '10:00', endTime: '12:28', price: 8, availableSeats: 100, totalSeats: 120, status: 'selling' },
  { id: '2', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '13:30', endTime: '15:58', price: 10, availableSeats: 80, totalSeats: 120, status: 'selling' },
  { id: '3', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '16:00', endTime: '18:28', price: 12, availableSeats: 50, totalSeats: 120, status: 'selling' },
  { id: '4', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '19:00', endTime: '21:28', price: 14, availableSeats: 20, totalSeats: 120, status: 'selling' },
  { id: '5', movieId: '1', cinemaId: '1', screenId: '1', date: '2024-12-20', startTime: '21:30', endTime: '23:58', price: 14, availableSeats: 0, totalSeats: 120, status: 'sold_out' },
  { id: '6', movieId: '2', cinemaId: '1', screenId: '2', date: '2024-12-20', startTime: '11:00', endTime: '13:05', price: 8, availableSeats: 90, totalSeats: 100, status: 'selling' },
  { id: '7', movieId: '3', cinemaId: '2', screenId: '1', date: '2024-12-20', startTime: '12:00', endTime: '14:15', price: 9, availableSeats: 110, totalSeats: 150, status: 'selling' },
  { id: '8', movieId: '4', cinemaId: '2', screenId: '2', date: '2024-12-20', startTime: '14:00', endTime: '15:50', price: 8, availableSeats: 80, totalSeats: 100, status: 'selling' },
  { id: '9', movieId: '5', cinemaId: '3', screenId: '1', date: '2024-12-21', startTime: '10:30', endTime: '13:05', price: 12, availableSeats: 100, totalSeats: 120, status: 'selling' },
  { id: '10', movieId: '6', cinemaId: '3', screenId: '2', date: '2024-12-21', startTime: '15:00', endTime: '17:20', price: 10, availableSeats: 90, totalSeats: 100, status: 'selling' },
];

// Initial Mock Data - Users (Customers)
const initialUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    phone: '+855 12 345 678',
    firstName: 'John',
    lastName: 'Doe',
    avatar: '',
    role: 'user',
    createdAt: '2024-01-15T10:30:00Z',
    favoriteMovies: ['1', '5'],
    favoriteCinemas: ['1'],
    notifications: { email: true, sms: true, push: true },
  },
  {
    id: '2',
    email: 'admin@cinemahub.com',
    phone: '+855 12 888 888',
    firstName: 'Admin',
    lastName: 'User',
    avatar: '',
    role: 'admin',
    createdAt: '2024-01-10T08:20:00Z',
    favoriteMovies: [],
    favoriteCinemas: [],
    notifications: { email: true, sms: true, push: true },
  },
  {
    id: '3',
    email: 'jane.smith@example.com',
    phone: '+855 12 345 679',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: '',
    role: 'user',
    createdAt: '2024-02-20T14:45:00Z',
    favoriteMovies: ['2', '3'],
    favoriteCinemas: ['2'],
    notifications: { email: true, sms: false, push: true },
  },
  {
    id: '4',
    email: 'bob.wilson@example.com',
    phone: '+855 12 345 680',
    firstName: 'Bob',
    lastName: 'Wilson',
    avatar: '',
    role: 'user',
    createdAt: '2024-03-05T09:15:00Z',
    favoriteMovies: ['4'],
    favoriteCinemas: ['1'],
    notifications: { email: false, sms: true, push: false },
  },
  {
    id: '5',
    email: 'alice.johnson@example.com',
    phone: '+855 12 345 681',
    firstName: 'Alice',
    lastName: 'Johnson',
    avatar: '',
    role: 'user',
    createdAt: '2024-03-12T16:30:00Z',
    favoriteMovies: ['1', '2', '5'],
    favoriteCinemas: ['3'],
    notifications: { email: true, sms: true, push: false },
  },
];

// Initial Mock Data - Bookings
const initialBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    movieId: '1',
    movieTitle: 'The Quantum Paradox',
    cinemaId: '1',
    cinemaName: 'Legend Cinema - Phnom Penh',
    screenId: '1',
    showtimeId: '1',
    showtime: '2024-12-20 10:00',
    seats: [
      { seatId: 'A1', seatNumber: 'A1', seatType: 'regular', price: 8 },
      { seatId: 'A2', seatNumber: 'A2', seatType: 'regular', price: 8 }
    ],
    ticketPrice: 8,
    totalPrice: 16,
    paymentMethod: 'card',
    paymentStatus: 'completed',
    bookingDate: '2024-12-15T10:30:00Z',
    status: 'confirmed',
    ticketCode: 'TKT001',
  },
  {
    id: '2',
    userId: '3',
    movieId: '2',
    movieTitle: 'Love in Paris',
    cinemaId: '1',
    cinemaName: 'Legend Cinema - Phnom Penh',
    screenId: '2',
    showtimeId: '6',
    showtime: '2024-12-20 11:00',
    seats: [
      { seatId: 'B5', seatNumber: 'B5', seatType: 'regular', price: 8 }
    ],
    ticketPrice: 8,
    totalPrice: 8,
    paymentMethod: 'card',
    paymentStatus: 'completed',
    bookingDate: '2024-12-16T14:20:00Z',
    status: 'confirmed',
    ticketCode: 'TKT002',
  },
  {
    id: '3',
    userId: '4',
    movieId: '3',
    movieTitle: 'Dark Shadows',
    cinemaId: '2',
    cinemaName: 'The Mall Cinema',
    screenId: '1',
    showtimeId: '7',
    showtime: '2024-12-20 12:00',
    seats: [
      { seatId: 'C3', seatNumber: 'C3', seatType: 'regular', price: 9 },
      { seatId: 'C4', seatNumber: 'C4', seatType: 'regular', price: 9 }
    ],
    ticketPrice: 9,
    totalPrice: 18,
    paymentMethod: 'card',
    paymentStatus: 'completed',
    bookingDate: '2024-12-17T09:15:00Z',
    status: 'confirmed',
    ticketCode: 'TKT003',
  },
];

// Initial Mock Data - Coupons
const initialCoupons = [
  { code: 'NEWUSER20', discountType: 'percentage' as const, discountValue: 20, minPurchase: 20, validUntil: '2025-12-31', maxUses: 100, usedCount: 45 },
  { code: 'MOVIE50', discountType: 'fixed' as const, discountValue: 5, minPurchase: 30, validUntil: '2025-06-30', maxUses: 200, usedCount: 120 },
  { code: 'WEEKEND30', discountType: 'percentage' as const, discountValue: 30, minPurchase: 25, validUntil: '2025-03-31', maxUses: 50, usedCount: 30 },
];

// Helper Functions
function getStoredData<T>(key: string, initialData: T): T {
  if (typeof window === 'undefined') return initialData;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialData;
    }
  }
  return initialData;
}

function setStoredData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Data Store API
export const dataStore = {
  // Initialize all data
  initialize() {
    // Initialize movies
    let movies = getStoredData<Movie[]>(STORAGE_KEYS.MOVIES, initialMovies);
    if (!movies || movies.length === 0) {
      movies = initialMovies;
      setStoredData(STORAGE_KEYS.MOVIES, movies);
    }
    // Initialize cinemas
    let cinemas = getStoredData<Cinema[]>(STORAGE_KEYS.CINEMAS, initialCinemas);
    if (!cinemas || cinemas.length === 0) {
      cinemas = initialCinemas;
      setStoredData(STORAGE_KEYS.CINEMAS, cinemas);
    }
    // Initialize showtimes
    let showtimes = getStoredData<Showtime[]>(STORAGE_KEYS.SHOWTIMES, initialShowtimes);
    if (!showtimes || showtimes.length === 0) {
      showtimes = initialShowtimes;
      setStoredData(STORAGE_KEYS.SHOWTIMES, showtimes);
    }
    // Initialize users
    let users = getStoredData<User[]>(STORAGE_KEYS.USERS, initialUsers);
    if (!users || users.length === 0) {
      users = initialUsers;
      setStoredData(STORAGE_KEYS.USERS, users);
    }
    // Initialize bookings
    let bookings = getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
    if (!bookings || bookings.length === 0) {
      bookings = initialBookings;
      setStoredData(STORAGE_KEYS.BOOKINGS, bookings);
    }
    // Initialize coupons
    let coupons = getStoredData(STORAGE_KEYS.COUPONS, initialCoupons);
    if (!coupons) {
      coupons = initialCoupons;
      setStoredData(STORAGE_KEYS.COUPONS, coupons);
    }
  },

  // Movies CRUD
  movies: {
    getAll: (): Movie[] => getStoredData<Movie[]>(STORAGE_KEYS.MOVIES, initialMovies),
    getById: (id: string): Movie | undefined => {
      const movies = getStoredData<Movie[]>(STORAGE_KEYS.MOVIES, initialMovies);
      return movies.find(m => m.id === id);
    },
    create: (movie: Omit<Movie, 'id' | 'createdAt' | 'updatedAt'>): Movie => {
      const movies = getStoredData<Movie[]>(STORAGE_KEYS.MOVIES, initialMovies);
      const newMovie: Movie = {
        ...movie,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      movies.push(newMovie);
      setStoredData(STORAGE_KEYS.MOVIES, movies);
      return newMovie;
    },
    update: (id: string, data: Partial<Movie>): Movie | undefined => {
      const movies = getStoredData<Movie[]>(STORAGE_KEYS.MOVIES, initialMovies);
      const index = movies.findIndex(m => m.id === id);
      if (index !== -1) {
        movies[index] = { ...movies[index], ...data, updatedAt: new Date().toISOString() };
        setStoredData(STORAGE_KEYS.MOVIES, movies);
        return movies[index];
      }
      return undefined;
    },
    delete: (id: string): boolean => {
      const movies = getStoredData<Movie[]>(STORAGE_KEYS.MOVIES, initialMovies);
      const filtered = movies.filter(m => m.id !== id);
      if (filtered.length !== movies.length) {
        setStoredData(STORAGE_KEYS.MOVIES, filtered);
        return true;
      }
      return false;
    },
  },

  // Cinemas CRUD
  cinemas: {
    getAll: (): Cinema[] => getStoredData<Cinema[]>(STORAGE_KEYS.CINEMAS, initialCinemas),
    getById: (id: string): Cinema | undefined => {
      const cinemas = getStoredData<Cinema[]>(STORAGE_KEYS.CINEMAS, initialCinemas);
      return cinemas.find(c => c.id === id);
    },
    create: (cinema: Omit<Cinema, 'id' | 'createdAt'>): Cinema => {
      const cinemas = getStoredData<Cinema[]>(STORAGE_KEYS.CINEMAS, initialCinemas);
      const newCinema: Cinema = {
        ...cinema,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      cinemas.push(newCinema);
      setStoredData(STORAGE_KEYS.CINEMAS, cinemas);
      return newCinema;
    },
    update: (id: string, data: Partial<Cinema>): Cinema | undefined => {
      const cinemas = getStoredData<Cinema[]>(STORAGE_KEYS.CINEMAS, initialCinemas);
      const index = cinemas.findIndex(c => c.id === id);
      if (index !== -1) {
        cinemas[index] = { ...cinemas[index], ...data };
        setStoredData(STORAGE_KEYS.CINEMAS, cinemas);
        return cinemas[index];
      }
      return undefined;
    },
    delete: (id: string): boolean => {
      const cinemas = getStoredData<Cinema[]>(STORAGE_KEYS.CINEMAS, initialCinemas);
      const filtered = cinemas.filter(c => c.id !== id);
      if (filtered.length !== cinemas.length) {
        setStoredData(STORAGE_KEYS.CINEMAS, filtered);
        return true;
      }
      return false;
    },
  },

  // Showtimes CRUD
  showtimes: {
    getAll: (): Showtime[] => getStoredData<Showtime[]>(STORAGE_KEYS.SHOWTIMES, initialShowtimes),
    getById: (id: string): Showtime | undefined => {
      const showtimes = getStoredData<Showtime[]>(STORAGE_KEYS.SHOWTIMES, initialShowtimes);
      return showtimes.find(s => s.id === id);
    },
    getByMovie: (movieId: string): Showtime[] => {
      const showtimes = getStoredData<Showtime[]>(STORAGE_KEYS.SHOWTIMES, initialShowtimes);
      return showtimes.filter(s => s.movieId === movieId);
    },
    getByCinema: (cinemaId: string): Showtime[] => {
      const showtimes = getStoredData<Showtime[]>(STORAGE_KEYS.SHOWTIMES, initialShowtimes);
      return showtimes.filter(s => s.cinemaId === cinemaId);
    },
    create: (showtime: Omit<Showtime, 'id'>): Showtime => {
      const showtimes = getStoredData<Showtime[]>(STORAGE_KEYS.SHOWTIMES, initialShowtimes);
      const newShowtime: Showtime = {
        ...showtime,
        id: Date.now().toString(),
      };
      showtimes.push(newShowtime);
      setStoredData(STORAGE_KEYS.SHOWTIMES, showtimes);
      return newShowtime;
    },
    update: (id: string, data: Partial<Showtime>): Showtime | undefined => {
      const showtimes = getStoredData<Showtime[]>(STORAGE_KEYS.SHOWTIMES, initialShowtimes);
      const index = showtimes.findIndex(s => s.id === id);
      if (index !== -1) {
        showtimes[index] = { ...showtimes[index], ...data };
        setStoredData(STORAGE_KEYS.SHOWTIMES, showtimes);
        return showtimes[index];
      }
      return undefined;
    },
    delete: (id: string): boolean => {
      const showtimes = getStoredData<Showtime[]>(STORAGE_KEYS.SHOWTIMES, initialShowtimes);
      const filtered = showtimes.filter(s => s.id !== id);
      if (filtered.length !== showtimes.length) {
        setStoredData(STORAGE_KEYS.SHOWTIMES, filtered);
        return true;
      }
      return false;
    },
  },

  // Users (Customers) CRUD
  users: {
    getAll: (): User[] => getStoredData<User[]>(STORAGE_KEYS.USERS, initialUsers),
    getById: (id: string): User | undefined => {
      const users = getStoredData<User[]>(STORAGE_KEYS.USERS, initialUsers);
      return users.find(u => u.id === id);
    },
    getByEmail: (email: string): User | undefined => {
      const users = getStoredData<User[]>(STORAGE_KEYS.USERS, initialUsers);
      return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    create: (user: Omit<User, 'id' | 'createdAt'>): User => {
      const users = getStoredData<User[]>(STORAGE_KEYS.USERS, initialUsers);
      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      setStoredData(STORAGE_KEYS.USERS, users);
      return newUser;
    },
    update: (id: string, data: Partial<User>): User | undefined => {
      const users = getStoredData<User[]>(STORAGE_KEYS.USERS, initialUsers);
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...data };
        setStoredData(STORAGE_KEYS.USERS, users);
        return users[index];
      }
      return undefined;
    },
    delete: (id: string): boolean => {
      const users = getStoredData<User[]>(STORAGE_KEYS.USERS, initialUsers);
      const filtered = users.filter(u => u.id !== id);
      if (filtered.length !== users.length) {
        setStoredData(STORAGE_KEYS.USERS, filtered);
        return true;
      }
      return false;
    },
  },

  // Bookings CRUD
  bookings: {
    getAll: (): Booking[] => getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings),
    getById: (id: string): Booking | undefined => {
      const bookings = getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
      return bookings.find(b => b.id === id);
    },
    getByUser: (userId: string): Booking[] => {
      const bookings = getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
      return bookings.filter(b => b.userId === userId);
    },
    getByMovie: (movieId: string): Booking[] => {
      const bookings = getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
      return bookings.filter(b => b.movieId === movieId);
    },
    create: (booking: Omit<Booking, 'id' | 'bookingDate' | 'ticketCode'>): Booking => {
      const bookings = getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
      const newBooking: Booking = {
        ...booking,
        id: Date.now().toString(),
        bookingDate: new Date().toISOString(),
        ticketCode: `TKT${Date.now()}`,
      };
      bookings.push(newBooking);
      setStoredData(STORAGE_KEYS.BOOKINGS, bookings);
      return newBooking;
    },
    update: (id: string, data: Partial<Booking>): Booking | undefined => {
      const bookings = getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
      const index = bookings.findIndex(b => b.id === id);
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...data };
        setStoredData(STORAGE_KEYS.BOOKINGS, bookings);
        return bookings[index];
      }
      return undefined;
    },
    delete: (id: string): boolean => {
      const bookings = getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
      const filtered = bookings.filter(b => b.id !== id);
      if (filtered.length !== bookings.length) {
        setStoredData(STORAGE_KEYS.BOOKINGS, filtered);
        return true;
      }
      return false;
    },
  },

  // Coupons
  coupons: {
    getAll: () => getStoredData(STORAGE_KEYS.COUPONS, initialCoupons),
    validate: (code: string, amount: number) => {
      const coupons = getStoredData(STORAGE_KEYS.COUPONS, initialCoupons) as any[];
      const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
      
      if (!coupon) {
        return { valid: false, discount: 0, message: 'Invalid coupon code' };
      }
      
      if (new Date(coupon.validUntil) < new Date()) {
        return { valid: false, discount: 0, message: 'Coupon has expired' };
      }
      
      if (coupon.usedCount >= coupon.maxUses) {
        return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
      }
      
      if (amount < coupon.minPurchase) {
        return { valid: false, discount: 0, message: `Minimum purchase of $${coupon.minPurchase} required` };
      }
      
      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = amount * (coupon.discountValue / 100);
      } else {
        discount = coupon.discountValue;
      }
      
      return { valid: true, discount, message: `${coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '$' + coupon.discountValue} discount applied!` };
    },
  },

  // Analytics
  analytics: {
    getTotalRevenue: (): number => {
      const bookings = getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
      return bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    },
    getTotalBookings: (): number => {
      const bookings = getStoredData<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
      return bookings.length;
    },
    getTotalUsers: (): number => {
      const users = getStoredData<User[]>(STORAGE_KEYS.USERS, initialUsers);
      return users.filter(u => u.role === 'user').length;
    },
  },
};

// Export types for external use
export type { Movie, Cinema, Showtime, Booking, User, Seat };
export { STORAGE_KEYS };