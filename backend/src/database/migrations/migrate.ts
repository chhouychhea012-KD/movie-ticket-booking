import sequelize from '../../config/database';
import User from '../../models/User';
import Movie from '../../models/Movie';
import Cinema from '../../models/Cinema';
import Showtime from '../../models/Showtime';
import Booking from '../../models/Booking';
import Ticket from '../../models/Ticket';
import Coupon from '../../models/Coupon';

export const runMigrations = async (): Promise<void> => {
  try {
    console.log('🔄 Running database migrations...');
    
    // Create all tables
    await sequelize.sync({ force: true });
    console.log('✅ All tables created successfully');
    
    console.log('📊 Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('✅ Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export default runMigrations;