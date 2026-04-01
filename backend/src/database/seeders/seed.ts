import { sequelize, User, Movie, Cinema, Showtime, Coupon } from '../../models';

interface SeedData {
  users: any[];
  movies: any[];
  cinemas: any[];
  showtimes: any[];
  coupons: any[];
}

const seedData: SeedData = {
  users: [
    {
      email: 'admin@cinemahub.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+855 12 888 888',
      role: 'admin',
      isActive: true,
      emailVerified: true,
    },
    {
      email: 'john.doe@example.com',
      password: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+855 12 345 678',
      role: 'user',
      isActive: true,
      emailVerified: true,
    },
    {
      email: 'jane.smith@example.com',
      password: 'user123',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+855 12 345 679',
      role: 'user',
      isActive: true,
      emailVerified: true,
    },
  ],
  movies: [
    {
      title: 'The Quantum Paradox',
      synopsis: 'A thrilling journey through time and space. When a brilliant physicist discovers a way to manipulate time, she must race against a shadow organization to prevent a catastrophic future.',
      genre: ['Sci-Fi', 'Action', 'Thriller'],
      language: 'English',
      duration: 148,
      rating: 8.5,
      ageRating: 'PG-13',
      releaseDate: '2024-12-15',
      poster: '/sci-fi-movie-poster.png',
      director: 'Sarah Chen',
      cast: ['Emma Watson', 'John Cho', 'Idris Elba'],
      status: 'now_showing',
      isFeatured: true,
    },
    {
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
      isFeatured: false,
    },
    {
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
      isFeatured: true,
    },
    {
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
      isFeatured: false,
    },
    {
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
      isFeatured: true,
    },
    {
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
      isFeatured: false,
    },
  ],
  cinemas: [
    {
      name: 'Legend Cinema - Phnom Penh',
      address: 'Russian Blvd, Phnom Penh',
      city: 'Phnom Penh',
      phone: '+855 23 888 888',
      email: 'info@legend.com',
      image: '/placeholder-cinema.jpg',
      facilities: ['Parking', 'Food Court', 'VIP Lounge', '3D', 'IMAX'],
      screens: [
        { id: '1', name: 'Screen 1', capacity: 150, screenType: 'standard' },
        { id: '2', name: 'Screen 2', capacity: 120, screenType: 'standard' },
        { id: '3', name: 'VIP Screen', capacity: 50, screenType: 'dolby_atmos' },
      ],
      isActive: true,
    },
    {
      name: 'The Mall Cinema',
      address: 'Sihanouk Blvd, Phnom Penh',
      city: 'Phnom Penh',
      phone: '+855 23 999 999',
      email: 'contact@themall.com',
      image: '/placeholder-cinema.jpg',
      facilities: ['Parking', 'Restaurant', '4DX', 'Dolby Atmos'],
      screens: [
        { id: '1', name: 'IMAX Screen', capacity: 200, screenType: 'imax' },
        { id: '2', name: 'Screen 2', capacity: 100, screenType: 'standard' },
      ],
      isActive: true,
    },
    {
      name: 'Aeon Mall Cinema',
      address: 'Monivong Blvd, Phnom Penh',
      city: 'Phnom Penh',
      phone: '+855 23 777 777',
      email: 'support@aeon.com',
      image: '/placeholder-cinema.jpg',
      facilities: ['Parking', 'Shopping', 'VIP', 'IMAX'],
      screens: [
        { id: '1', name: '4DX Screen', capacity: 80, screenType: '4dx' },
        { id: '2', name: 'Dolby Screen', capacity: 120, screenType: 'dolby_atmos' },
        { id: '3', name: 'Screen 3', capacity: 100, screenType: 'standard' },
      ],
      isActive: true,
    },
    {
      name: 'Legend Cinema - Siem Reap',
      address: 'Sivatha Blvd, Siem Reap',
      city: 'Siem Reap',
      phone: '+855 63 888 888',
      email: 'info.sr@legend.com',
      image: '/placeholder-cinema.jpg',
      facilities: ['Parking', 'Food Court', '3D'],
      screens: [
        { id: '1', name: 'Screen 1', capacity: 100, screenType: 'standard' },
        { id: '2', name: 'Screen 2', capacity: 80, screenType: 'standard' },
      ],
      isActive: true,
    },
  ],
  showtimes: [],
  coupons: [
    {
      code: 'NEWUSER20',
      description: '20% off for new users',
      discountType: 'percentage',
      discountValue: 20,
      minPurchase: 20,
      validUntil: '2025-12-31',
      maxUses: 100,
      usedCount: 45,
      isActive: true,
    },
    {
      code: 'MOVIE50',
      description: '$5 off on movie tickets',
      discountType: 'fixed',
      discountValue: 5,
      minPurchase: 30,
      validUntil: '2025-06-30',
      maxUses: 200,
      usedCount: 120,
      isActive: true,
    },
    {
      code: 'WEEKEND30',
      description: '30% off on weekends',
      discountType: 'percentage',
      discountValue: 30,
      minPurchase: 25,
      validUntil: '2025-03-31',
      maxUses: 50,
      usedCount: 30,
      isActive: true,
    },
  ],
};

export const runSeeders = async (): Promise<void> => {
  try {
    console.log('🔄 Running database seeders...');

    // Ensure models are synced before seeding
    await sequelize.sync({ force: false });
    console.log('✅ Models synced');

    // Seed Users
    console.log('👤 Seeding users...');
    for (const userData of seedData.users) {
      await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData,
      });
    }
    console.log('✅ Users seeded');

    // Seed Movies
    console.log('🎬 Seeding movies...');
    const movies = await Movie.bulkCreate(seedData.movies);
    console.log('✅ Movies seeded');

    // Seed Cinemas
    console.log('🏛️ Seeding cinemas...');
    const cinemas = await Cinema.bulkCreate(seedData.cinemas);
    console.log('✅ Cinemas seeded');

    // Seed Showtimes
    console.log('🕐 Seeding showtimes...');
    const today = new Date();
    for (const movie of movies) {
      for (const cinema of cinemas) {
        // Create 4 showtimes per movie per cinema
        const times = ['10:00', '13:30', '16:00', '19:00'];
        const prices = [8, 10, 12, 14];
        
        for (let i = 0; i < times.length; i++) {
          const screen = cinema.screens[0];
          await Showtime.create({
            movieId: movie.id,
            cinemaId: cinema.id,
            screenId: screen.id,
            date: new Date(today.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            startTime: times[i],
            endTime: `${parseInt(times[i]) + 2}:30`,
            price: prices[i],
            availableSeats: screen.capacity - Math.floor(Math.random() * 50),
            totalSeats: screen.capacity,
            status: 'selling',
          });
        }
      }
    }
    console.log('✅ Showtimes seeded');

    // Seed Coupons
    console.log('🎟️ Seeding coupons...');
    await Coupon.bulkCreate(seedData.coupons);
    console.log('✅ Coupons seeded');

    console.log('📊 Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run seeders if called directly
if (require.main === module) {
  runSeeders()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export default runSeeders;