import { Booking, Cinema, Coupon, Movie, Notification, Showtime, Ticket, User, sequelize } from '../../models';

type SeatType = 'regular' | 'vip' | 'couple' | 'accessible';

interface SeatSeed {
  seatId: string;
  seatNumber: string;
  seatType: SeatType;
  price: number;
}

const sourceLinks = {
  superman: 'https://www.rottentomatoes.com/m/superman_2025',
  fantasticFour: 'https://movies.disney.com/the-fantastic-four-first-steps',
  jurassicWorld: 'https://www.wikizero.org/wiki/en/Jurassic_World_Rebirth',
  missionImpossible: 'https://www.imdb.com/title/tt9603208',
  f1: 'https://www.f1themovie.com/synopsis/',
  liloStitch: 'https://movies.disney.com/lilo-and-stitch-2025',
  dragon: 'https://www.bbfc.co.uk/release/how-to-train-your-dragon-q29sbgvjdglvbjpwwc0xmdi1otc0',
  wicked: 'https://www.universalpicturesathome.com/movies/wicked-for-good',
  avengers: 'https://www.marvel.com/movies/avengers-doomsday',
  spiderMan: 'https://www.sonypictures.com/movies/spidermanbrandnewday',
  mandalorian: 'https://www.starwars.com/films/star-wars-the-mandalorian-and-grogu',
};

const posterLinks = {
  superman: 'https://tecolotito.elsiglodedurango.com.mx/cdn-cgi/image/format%3Dwebp%2Cwidth%3D412/i/2024/12/1292401.jpeg',
  fantasticFour: 'https://fr.web.img4.acsta.net/img/1f/cc/1fcc1f3c574cab5e9db8e6a427ba040a.jpg',
  jurassicWorld: 'https://m.media-amazon.com/images/M/MV5BMTU0MDM1YmMtODZjNS00ZDYzLTllZmMtOGNiZmVhYTQyNGYwXkEyXkFqcGc@._V1_.jpg',
  missionImpossible: 'https://images.squarespace-cdn.com/content/v1/61d3a1dc960d41134f8ac264/3888e9d9-2085-460b-a6e1-9de27d737b3a/Tom%2BCruise%2B-%2B%2522Ethan%2BHunt%2522%2BMission%2BImpossible%2BThe%2BFinal%2BReckoning%2BEntertainment%2BInterviews%2BVS%2BBrands%2BCharacter%2BPoster%2B3.jpg',
  f1: 'https://www.impawards.com/2025/posters/f_one.jpg',
  liloStitch: 'https://m.media-amazon.com/images/M/MV5BYTBmMDBhNWYtNTk4MS00NzBmLTk5ZWItM2ZlZjY4NTYxNWQzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
  dragon: 'https://cdn.7days.ru/pic/2d7/1018635/1712385/88.jpg',
  wicked: 'https://posters.onesheet.org/posters/current/2025/wicked-for-good-2025-us-teaser.jpg',
  avengers: 'https://cdn.moviefone.com/admin-uploads/highlights/images/avengers-doomsday-official-poster_1784553983.webp',
  spiderMan: 'https://www.newdvdreleasedates.com/images/posters/large/spider-man-brand-new-day-2026.jpg',
  mandalorian: 'https://www.flickeringmyth.com/wp-content/uploads/2026/02/star-wars-the-mandalorian-and-grogu-13.jpg',
};

const cinemaImages = {
  premiumHall: 'https://img.rurubu.jp/img_srw/andmore/images/0000724431/drU8ev48fXDgzyzfHi5FaxOGG0tvpApnVsuK9dMM.jpg',
  reclinerHall: 'https://images.mindtrip.ai/attractions/06f7/7d4f/9808/0b0a/5988/c1ba/34f6/17ea',
  multiplex: 'https://www.vietnam-briefing.com/news/wp-content/uploads/2023/11/MicrosoftTeams-image-77.jpg',
  imaxHall: 'https://kinotechnology.com/img/portfolio/redi_3.jpg',
  classicHall: 'https://images1.loopnet.com/i2/eyLybRAk0te5pZ7jk68OfNnR0jd7hSYTnAqaezjZ5W4/116/4345-W-New-Haven-Ave-Melbourne-FL-Theater-15-to-Exit-5-LargeHighDefinition.jpg',
};

const upsertBy = async (
  model: any,
  where: Record<string, unknown>,
  defaults: Record<string, unknown>
): Promise<any> => {
  const record = await model.findOne({ where });

  if (record) {
    await record.update(defaults);
    return record;
  }

  return model.create({ ...where, ...defaults });
};

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

const addDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

const addMinutesToTime = (time: string, minutes: number): string => {
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date(2026, 0, 1, hour, minute);
  date.setMinutes(date.getMinutes() + minutes + 25);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const buildScreens = (prefix: string) => [
  {
    id: `${prefix}-screen-1`,
    cinemaId: prefix,
    name: 'Hall 1 - Premium Laser',
    capacity: 96,
    screenType: 'Laser 2D',
    seatLayout: { rows: 8, seatsPerRow: 12, aislePositions: [4, 8] },
  },
  {
    id: `${prefix}-screen-2`,
    cinemaId: prefix,
    name: 'Hall 2 - Dolby Atmos',
    capacity: 120,
    screenType: 'Dolby Atmos',
    seatLayout: { rows: 10, seatsPerRow: 12, aislePositions: [4, 8] },
  },
  {
    id: `${prefix}-screen-3`,
    cinemaId: prefix,
    name: 'Hall 3 - VIP Recliner',
    capacity: 64,
    screenType: 'VIP Recliner',
    seatLayout: { rows: 8, seatsPerRow: 8, aislePositions: [4] },
  },
];

const seatPrice = (basePrice: number, seatType: SeatType): number => {
  if (seatType === 'vip') return Number((basePrice * 1.5).toFixed(2));
  if (seatType === 'couple') return Number((basePrice * 1.3).toFixed(2));
  return Number(basePrice.toFixed(2));
};

const createSampleBooking = async (
  ticketCode: string,
  user: any,
  showtime: any,
  movie: any,
  cinema: any,
  seatNumbers: Array<{ seatNumber: string; seatType: SeatType }>,
  couponCode?: string
) => {
  const basePrice = Number(showtime.price);
  const seats: SeatSeed[] = seatNumbers.map((seat, index) => ({
    seatId: `${seat.seatNumber}-${index + 1}`,
    seatNumber: seat.seatNumber,
    seatType: seat.seatType,
    price: seatPrice(basePrice, seat.seatType),
  }));
  const ticketPrice = seats.reduce((sum, seat) => sum + seat.price, 0);
  const discount = couponCode ? Number((ticketPrice * 0.1).toFixed(2)) : 0;
  const totalPrice = Number((ticketPrice - discount).toFixed(2));
  const existingBooking = await Booking.findOne({ where: { ticketCode } });
  const previousSeatCount = existingBooking && existingBooking.showtimeId === showtime.id
    ? (existingBooking.seats || []).length
    : 0;

  const booking = await upsertBy(
    Booking,
    { ticketCode },
    {
      userId: user.id,
      movieId: movie.id,
      movieTitle: movie.title,
      cinemaId: cinema.id,
      cinemaName: cinema.name,
      screenId: showtime.screenId,
      showtimeId: showtime.id,
      showtime: `${showtime.date} ${showtime.startTime}`,
      seats,
      ticketPrice,
      totalPrice,
      discount,
      couponCode,
      paymentMethod: 'card',
      paymentStatus: 'completed',
      status: 'confirmed',
      bookingDate: new Date(),
    }
  );

  await Ticket.destroy({ where: { bookingId: booking.id } });

  await Promise.all(
    seats.map((seat, index) =>
      Ticket.create({
        bookingId: booking.id,
        seatId: seat.seatId,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        price: seat.price,
        status: 'valid',
        qrCode: `${ticketCode}-${seat.seatNumber}-${index + 1}`,
      })
    )
  );

  const seatDelta = seats.length - previousSeatCount;
  if (seatDelta !== 0) {
    const nextAvailableSeats = Math.max(
      0,
      Math.min(Number(showtime.totalSeats), Number(showtime.availableSeats) - seatDelta)
    );
    await showtime.update({
      availableSeats: nextAvailableSeats,
      status: nextAvailableSeats === 0 ? 'sold_out' : 'selling',
    });
  }

  return booking;
};

const seedDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ force: false });
    console.log('Database synchronized.');

    const users = await Promise.all([
      upsertBy(User, { email: 'owner@cambocine.online' }, {
        email: 'owner@cambocine.online',
        password: 'owner123',
        firstName: 'System',
        lastName: 'Owner',
        phone: '+85512888001',
        avatar: 'https://ui-avatars.com/api/?name=System+Owner&background=111827&color=ffffff',
        role: 'owner',
        isActive: true,
        emailVerified: true,
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: true, push: true },
      }),
      upsertBy(User, { email: 'admin@cambocine.online' }, {
        email: 'admin@cambocine.online',
        password: 'admin123',
        firstName: 'Cinema',
        lastName: 'Admin',
        phone: '+85512888002',
        avatar: 'https://ui-avatars.com/api/?name=Cinema+Admin&background=be123c&color=ffffff',
        role: 'admin',
        isActive: true,
        emailVerified: true,
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: true, push: true },
      }),
      upsertBy(User, { email: 'staff@cambocine.online' }, {
        email: 'staff@cambocine.online',
        password: 'staff123',
        firstName: 'Sokha',
        lastName: 'Staff',
        phone: '+85512888003',
        avatar: 'https://ui-avatars.com/api/?name=Sokha+Staff&background=0f766e&color=ffffff',
        role: 'staff',
        isActive: true,
        emailVerified: true,
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: false, push: true },
      }),
      upsertBy(User, { email: 'john.doe@example.com' }, {
        email: 'john.doe@example.com',
        password: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+85512888004',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=1f2937&color=ffffff',
        role: 'customer',
        isActive: true,
        emailVerified: true,
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: true, push: true },
      }),
      upsertBy(User, { email: 'jane.smith@example.com' }, {
        email: 'jane.smith@example.com',
        password: 'user123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+85512888005',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=7c2d12&color=ffffff',
        role: 'customer',
        isActive: true,
        emailVerified: true,
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: false, push: true },
      }),
      upsertBy(User, { email: 'vip.customer@example.com' }, {
        email: 'vip.customer@example.com',
        password: 'user123',
        firstName: 'Dara',
        lastName: 'VIP',
        phone: '+85512888006',
        avatar: 'https://ui-avatars.com/api/?name=Dara+VIP&background=854d0e&color=ffffff',
        role: 'customer',
        isActive: true,
        emailVerified: true,
        favoriteMovies: [],
        favoriteCinemas: [],
        notifications: { email: true, sms: true, push: true },
      }),
    ]);

    console.log(`Seeded ${users.length} demo users.`);

    const movieRecords = await Promise.all([
      upsertBy(Movie, { title: 'Superman' }, {
        title: 'Superman',
        synopsis: 'Clark Kent balances his Kryptonian heritage with his human life while defending a world that needs hope.',
        genre: ['Action', 'Adventure', 'Sci-Fi', 'Fantasy'],
        language: 'English',
        duration: 129,
        rating: 8.3,
        ageRating: 'PG-13',
        releaseDate: new Date('2025-07-11'),
        trailerUrl: sourceLinks.superman,
        poster: posterLinks.superman,
        director: 'James Gunn',
        cast: ['David Corenswet', 'Rachel Brosnahan', 'Nicholas Hoult', 'Edi Gathegi', 'Nathan Fillion'],
        status: 'now_showing',
        isFeatured: true,
      }),
      upsertBy(Movie, { title: 'The Fantastic Four: First Steps' }, {
        title: 'The Fantastic Four: First Steps',
        synopsis: 'Marvels first family protects a retro-futuristic world from cosmic danger while holding their family together.',
        genre: ['Action', 'Adventure', 'Superhero', 'Sci-Fi'],
        language: 'English',
        duration: 115,
        rating: 8.1,
        ageRating: 'PG-13',
        releaseDate: new Date('2025-07-25'),
        trailerUrl: sourceLinks.fantasticFour,
        poster: posterLinks.fantasticFour,
        director: 'Matt Shakman',
        cast: ['Pedro Pascal', 'Vanessa Kirby', 'Joseph Quinn', 'Ebon Moss-Bachrach', 'Julia Garner'],
        status: 'now_showing',
        isFeatured: true,
      }),
      upsertBy(Movie, { title: 'Jurassic World Rebirth' }, {
        title: 'Jurassic World Rebirth',
        synopsis: 'A covert expedition enters a restricted island facility to recover genetic material from the largest dinosaurs.',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        duration: 133,
        rating: 7.7,
        ageRating: 'PG-13',
        releaseDate: new Date('2025-07-02'),
        trailerUrl: sourceLinks.jurassicWorld,
        poster: posterLinks.jurassicWorld,
        director: 'Gareth Edwards',
        cast: ['Scarlett Johansson', 'Mahershala Ali', 'Jonathan Bailey', 'Rupert Friend', 'Manuel Garcia-Rulfo'],
        status: 'now_showing',
        isFeatured: true,
      }),
      upsertBy(Movie, { title: 'Mission: Impossible - The Final Reckoning' }, {
        title: 'Mission: Impossible - The Final Reckoning',
        synopsis: 'Ethan Hunt and the IMF team race against time in a globe-spanning mission with impossible stakes.',
        genre: ['Action', 'Adventure', 'Thriller'],
        language: 'English',
        duration: 169,
        rating: 8.0,
        ageRating: 'PG-13',
        releaseDate: new Date('2025-05-23'),
        trailerUrl: sourceLinks.missionImpossible,
        poster: posterLinks.missionImpossible,
        director: 'Christopher McQuarrie',
        cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg', 'Esai Morales'],
        status: 'now_showing',
        isFeatured: true,
      }),
      upsertBy(Movie, { title: 'F1 The Movie' }, {
        title: 'F1 The Movie',
        synopsis: 'A former Formula 1 driver returns to mentor a rising talent and chase one last shot at glory.',
        genre: ['Action', 'Drama', 'Sport'],
        language: 'English',
        duration: 155,
        rating: 8.2,
        ageRating: 'PG-13',
        releaseDate: new Date('2025-06-27'),
        trailerUrl: sourceLinks.f1,
        poster: posterLinks.f1,
        director: 'Joseph Kosinski',
        cast: ['Brad Pitt', 'Damson Idris', 'Kerry Condon', 'Tobias Menzies', 'Javier Bardem'],
        status: 'now_showing',
        isFeatured: false,
      }),
      upsertBy(Movie, { title: 'Lilo & Stitch' }, {
        title: 'Lilo & Stitch',
        synopsis: 'A lonely Hawaiian girl adopts an unusual alien and discovers the meaning of family.',
        genre: ['Adventure', 'Comedy', 'Family', 'Sci-Fi'],
        language: 'English',
        duration: 112,
        rating: 7.6,
        ageRating: 'PG',
        releaseDate: new Date('2025-05-23'),
        trailerUrl: sourceLinks.liloStitch,
        poster: posterLinks.liloStitch,
        director: 'Dean Fleischer Camp',
        cast: ['Maia Kealoha', 'Sydney Elizebeth Agudong', 'Billy Magnussen', 'Tia Carrere', 'Chris Sanders'],
        status: 'now_showing',
        isFeatured: false,
      }),
      upsertBy(Movie, { title: 'How to Train Your Dragon' }, {
        title: 'How to Train Your Dragon',
        synopsis: 'Hiccup and Toothless form a bond that changes the future of Vikings and dragons.',
        genre: ['Action', 'Adventure', 'Family', 'Fantasy'],
        language: 'English',
        duration: 125,
        rating: 8.4,
        ageRating: 'PG',
        releaseDate: new Date('2025-06-13'),
        trailerUrl: sourceLinks.dragon,
        poster: posterLinks.dragon,
        director: 'Dean DeBlois',
        cast: ['Mason Thames', 'Nico Parker', 'Gerard Butler', 'Nick Frost', 'Julian Dennison'],
        status: 'now_showing',
        isFeatured: false,
      }),
      upsertBy(Movie, { title: 'Wicked: For Good' }, {
        title: 'Wicked: For Good',
        synopsis: 'Elphaba and Glinda face the consequences of their choices as Oz changes around them.',
        genre: ['Drama', 'Family', 'Musical', 'Fantasy'],
        language: 'English',
        duration: 138,
        rating: 8.1,
        ageRating: 'PG',
        releaseDate: new Date('2025-11-21'),
        trailerUrl: sourceLinks.wicked,
        poster: posterLinks.wicked,
        director: 'Jon M. Chu',
        cast: ['Cynthia Erivo', 'Ariana Grande-Butera', 'Jonathan Bailey', 'Michelle Yeoh', 'Jeff Goldblum'],
        status: 'now_showing',
        isFeatured: false,
      }),
      upsertBy(Movie, { title: 'Avengers: Doomsday' }, {
        title: 'Avengers: Doomsday',
        synopsis: 'Earths heroes prepare for a multiverse-shaking threat led by Doctor Doom.',
        genre: ['Action', 'Adventure', 'Superhero', 'Sci-Fi'],
        language: 'English',
        duration: 150,
        rating: 0,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-12-18'),
        trailerUrl: sourceLinks.avengers,
        poster: posterLinks.avengers,
        director: 'Joe Russo, Anthony Russo',
        cast: ['Robert Downey Jr.', 'Chris Hemsworth', 'Anthony Mackie', 'Vanessa Kirby', 'Pedro Pascal'],
        status: 'coming_soon',
        isFeatured: true,
      }),
      upsertBy(Movie, { title: 'Spider-Man: Brand New Day' }, {
        title: 'Spider-Man: Brand New Day',
        synopsis: 'Peter Parker steps into a new chapter while old responsibilities pull him back into action.',
        genre: ['Action', 'Adventure', 'Superhero'],
        language: 'English',
        duration: 135,
        rating: 0,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-07-31'),
        trailerUrl: sourceLinks.spiderMan,
        poster: posterLinks.spiderMan,
        director: 'Destin Daniel Cretton',
        cast: ['Tom Holland', 'Zendaya', 'Sadie Sink', 'Jacob Batalon', 'Mark Ruffalo'],
        status: 'coming_soon',
        isFeatured: false,
      }),
      upsertBy(Movie, { title: 'Star Wars: The Mandalorian and Grogu' }, {
        title: 'Star Wars: The Mandalorian and Grogu',
        synopsis: 'Din Djarin and Grogu head to the big screen for a new Star Wars adventure.',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        duration: 120,
        rating: 0,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-05-22'),
        trailerUrl: sourceLinks.mandalorian,
        poster: posterLinks.mandalorian,
        director: 'Jon Favreau',
        cast: ['Pedro Pascal', 'Sigourney Weaver', 'Grogu'],
        status: 'coming_soon',
        isFeatured: false,
      }),
    ]);

    console.log(`Seeded ${movieRecords.length} movies with poster/source links.`);

    const cinemaRecords = await Promise.all([
      upsertBy(Cinema, { name: 'CamboCine Aeon Mall Phnom Penh' }, {
        name: 'CamboCine Aeon Mall Phnom Penh',
        address: '132 Samdach Sothearos Blvd, Tonle Bassac, Phnom Penh',
        city: 'Phnom Penh',
        phone: '+85523888001',
        email: 'aeonpp@cambocine.online',
        image: cinemaImages.premiumHall,
        facilities: ['Dolby Atmos', 'Online Booking', 'Food Court', 'Parking', 'Wheelchair Access'],
        screens: buildScreens('aeon-pp'),
        isActive: true,
      }),
      upsertBy(Cinema, { name: 'CamboCine Olympia City' }, {
        name: 'CamboCine Olympia City',
        address: 'Olympia Mall, Street 182, Veal Vong, Phnom Penh',
        city: 'Phnom Penh',
        phone: '+85523888002',
        email: 'olympia@cambocine.online',
        image: cinemaImages.reclinerHall,
        facilities: ['VIP Recliner', 'Laser Projection', 'Cafe', 'Parking', 'Family Seats'],
        screens: buildScreens('olympia'),
        isActive: true,
      }),
      upsertBy(Cinema, { name: 'CamboCine Siem Reap Riverside' }, {
        name: 'CamboCine Siem Reap Riverside',
        address: 'Old Market Riverside, Krong Siem Reap',
        city: 'Siem Reap',
        phone: '+85563888003',
        email: 'siemreap@cambocine.online',
        image: cinemaImages.multiplex,
        facilities: ['Premium Seats', 'Tourist Desk', 'Snack Bar', 'Online Booking'],
        screens: buildScreens('siem-reap'),
        isActive: true,
      }),
      upsertBy(Cinema, { name: 'CamboCine Battambang Central' }, {
        name: 'CamboCine Battambang Central',
        address: 'Street 3, Svay Por, Battambang',
        city: 'Battambang',
        phone: '+85553888004',
        email: 'battambang@cambocine.online',
        image: cinemaImages.classicHall,
        facilities: ['Classic Hall', 'Student Discount', 'Snack Bar', 'Motorbike Parking'],
        screens: buildScreens('battambang'),
        isActive: true,
      }),
      upsertBy(Cinema, { name: 'CamboCine Premium IMAX Sen Sok' }, {
        name: 'CamboCine Premium IMAX Sen Sok',
        address: 'Street 1003, Phnom Penh Thmei, Sen Sok, Phnom Penh',
        city: 'Phnom Penh',
        phone: '+85523888005',
        email: 'sensok@cambocine.online',
        image: cinemaImages.imaxHall,
        facilities: ['IMAX', 'Dolby Atmos', 'VIP Lounge', 'Premium Parking', 'Mobile Check-in'],
        screens: buildScreens('sen-sok'),
        isActive: true,
      }),
    ]);

    console.log(`Seeded ${cinemaRecords.length} cinemas.`);

    const coupons = await Promise.all([
      upsertBy(Coupon, { code: 'NEWUSER20' }, {
        code: 'NEWUSER20',
        description: '20% off for first-time movie booking customers.',
        discountType: 'percentage',
        discountValue: 20,
        minPurchase: 10,
        validUntil: new Date('2027-12-31'),
        maxUses: 500,
        usedCount: 0,
        isActive: true,
      }),
      upsertBy(Coupon, { code: 'WEEKEND30' }, {
        code: 'WEEKEND30',
        description: '$3 off selected weekend showtimes.',
        discountType: 'fixed',
        discountValue: 3,
        minPurchase: 15,
        validUntil: new Date('2027-12-31'),
        maxUses: 300,
        usedCount: 0,
        isActive: true,
      }),
      upsertBy(Coupon, { code: 'FAMILY15' }, {
        code: 'FAMILY15',
        description: '15% off family bookings with three or more tickets.',
        discountType: 'percentage',
        discountValue: 15,
        minPurchase: 24,
        validUntil: new Date('2027-12-31'),
        maxUses: 250,
        usedCount: 0,
        isActive: true,
      }),
      upsertBy(Coupon, { code: 'VIP10' }, {
        code: 'VIP10',
        description: '$10 off VIP recliner bookings.',
        discountType: 'fixed',
        discountValue: 10,
        minPurchase: 35,
        validUntil: new Date('2027-12-31'),
        maxUses: 100,
        usedCount: 0,
        isActive: true,
      }),
      upsertBy(Coupon, { code: 'STUDENT5' }, {
        code: 'STUDENT5',
        description: '$5 student discount for weekday bookings.',
        discountType: 'fixed',
        discountValue: 5,
        minPurchase: 12,
        validUntil: new Date('2027-12-31'),
        maxUses: 400,
        usedCount: 0,
        isActive: true,
      }),
    ]);

    console.log(`Seeded ${coupons.length} coupons.`);

    const showtimeTemplates = ['10:30', '13:45', '17:20', '20:40'];
    const activeMovies = movieRecords.filter((movie) => movie.status === 'now_showing');
    const showtimeRecords: any[] = [];

    for (const [movieIndex, movie] of activeMovies.entries()) {
      for (const [cinemaIndex, cinema] of cinemaRecords.entries()) {
        const screens = cinema.screens as Array<{ id: string; capacity: number }>;

        for (let day = 1; day <= 7; day += 1) {
          const screen = screens[(movieIndex + day + cinemaIndex) % screens.length];
          const timesForDay = showtimeTemplates.filter((_, index) => (index + movieIndex + cinemaIndex + day) % 2 === 0);

          for (const startTime of timesForDay) {
            const basePrice = cinema.name.includes('IMAX') ? 13 : cinema.name.includes('VIP') ? 12 : 9;
            const price = Number((basePrice + (movieIndex % 3) + (startTime >= '20:00' ? 2 : 0)).toFixed(2));
            const showtime = await upsertBy(
              Showtime,
              {
                movieId: movie.id,
                cinemaId: cinema.id,
                screenId: screen.id,
                date: addDays(day),
                startTime,
              },
              {
                movieId: movie.id,
                cinemaId: cinema.id,
                screenId: screen.id,
                date: addDays(day),
                startTime,
                endTime: addMinutesToTime(startTime, Number(movie.duration)),
                price,
                availableSeats: screen.capacity,
                totalSeats: screen.capacity,
                status: 'selling',
              }
            );

            showtimeRecords.push(showtime);
          }
        }
      }
    }

    console.log(`Seeded ${showtimeRecords.length} showtimes for the next 7 days.`);

    const john = users.find((user) => user.email === 'john.doe@example.com');
    const jane = users.find((user) => user.email === 'jane.smith@example.com');
    const vip = users.find((user) => user.email === 'vip.customer@example.com');
    const findShowtime = (movie: any, cinema: any) =>
      showtimeRecords.find((showtime) => showtime.movieId === movie.id && showtime.cinemaId === cinema.id);

    if (john && jane && vip) {
      await users[3].update({
        favoriteMovies: [movieRecords[0].id, movieRecords[2].id, movieRecords[5].id],
        favoriteCinemas: [cinemaRecords[0].id, cinemaRecords[4].id],
      });
      await users[4].update({
        favoriteMovies: [movieRecords[1].id, movieRecords[6].id],
        favoriteCinemas: [cinemaRecords[1].id],
      });
      await users[5].update({
        favoriteMovies: [movieRecords[3].id, movieRecords[4].id],
        favoriteCinemas: [cinemaRecords[4].id],
      });

      const johnShowtime = findShowtime(movieRecords[0], cinemaRecords[0]);
      const janeShowtime = findShowtime(movieRecords[1], cinemaRecords[1]);
      const vipShowtime = findShowtime(movieRecords[2], cinemaRecords[4]);

      if (!johnShowtime || !janeShowtime || !vipShowtime) {
        throw new Error('Unable to find sample showtimes for demo bookings.');
      }

      await Promise.all([
        createSampleBooking('CH-DEMO-1001', john, johnShowtime, movieRecords[0], cinemaRecords[0], [
          { seatNumber: 'E5', seatType: 'regular' },
          { seatNumber: 'E6', seatType: 'regular' },
        ], 'NEWUSER20'),
        createSampleBooking('CH-DEMO-1002', jane, janeShowtime, movieRecords[1], cinemaRecords[1], [
          { seatNumber: 'C3', seatType: 'vip' },
          { seatNumber: 'C4', seatType: 'vip' },
        ], 'VIP10'),
        createSampleBooking('CH-DEMO-1003', vip, vipShowtime, movieRecords[2], cinemaRecords[4], [
          { seatNumber: 'F7', seatType: 'regular' },
          { seatNumber: 'F8', seatType: 'regular' },
          { seatNumber: 'F9', seatType: 'regular' },
        ], 'FAMILY15'),
      ]);
    }

    const notifications = await Promise.all([
      upsertBy(Notification, { title: 'Welcome to CamboCine', userId: john?.id }, {
        type: 'system',
        title: 'Welcome to CamboCine',
        message: 'Your movie booking account is ready. Browse showtimes and book your next seat.',
        read: false,
        userId: john?.id,
      }),
      upsertBy(Notification, { title: 'Booking Confirmed', userId: john?.id }, {
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your Superman booking is confirmed. Your digital ticket is available now.',
        read: false,
        userId: john?.id,
      }),
      upsertBy(Notification, { title: 'VIP Offer Available', userId: vip?.id }, {
        type: 'success',
        title: 'VIP Offer Available',
        message: 'Use VIP10 for selected VIP recliner seats this week.',
        read: false,
        userId: vip?.id,
      }),
      upsertBy(Notification, { title: 'New Showtimes Added' }, {
        type: 'system',
        title: 'New Showtimes Added',
        message: 'Fresh showtimes are available for premium evening screenings.',
        read: false,
      }),
      upsertBy(Notification, { title: 'Low Seat Availability' }, {
        type: 'alert',
        title: 'Low Seat Availability',
        message: 'Some weekend shows are filling quickly. Check availability before booking.',
        read: false,
      }),
    ]);

    console.log(`Seeded ${notifications.length} notifications.`);
    console.log('');
    console.log('Seed data completed successfully.');
    console.log('Demo logins:');
    console.log('Owner: owner@cambocine.online / owner123');
    console.log('Admin: admin@cambocine.online / admin123');
    console.log('Staff: staff@cambocine.online / staff123');
    console.log('Customer: john.doe@example.com / user123');
    console.log('Customer: jane.smith@example.com / user123');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
