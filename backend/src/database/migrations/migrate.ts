import sequelize from '../../config/database';
import '../../models';

const migrateUserRoleToCustomer = async (): Promise<void> => {
  const dialect = sequelize.getDialect();

  if (dialect === 'mysql' || dialect === 'mariadb') {
    await sequelize.query(
      "ALTER TABLE users MODIFY COLUMN role ENUM('user','customer','staff','admin','owner') NOT NULL DEFAULT 'customer'"
    );
    await sequelize.query("UPDATE users SET role = 'customer' WHERE role = 'user'");
    await sequelize.query(
      "ALTER TABLE users MODIFY COLUMN role ENUM('customer','staff','admin','owner') NOT NULL DEFAULT 'customer'"
    );
    return;
  }

  await sequelize.query("UPDATE users SET role = 'customer' WHERE role = 'user'");
};

const migrateUserAvatarColumn = async (): Promise<void> => {
  const dialect = sequelize.getDialect();

  if (dialect === 'mysql' || dialect === 'mariadb') {
    await sequelize.query('ALTER TABLE users MODIFY COLUMN avatar TEXT NULL');
  }
};

const migrateCinemaImageColumn = async (): Promise<void> => {
  const dialect = sequelize.getDialect();

  if (dialect === 'mysql' || dialect === 'mariadb') {
    await sequelize.query('ALTER TABLE cinemas MODIFY COLUMN image MEDIUMTEXT NULL');
  }
};

export const runMigrations = async (): Promise<void> => {
  try {
    console.log('Running database migrations...');

    const force = process.env.DB_SYNC_FORCE === 'true';
    const alter = process.env.DB_SYNC_ALTER === 'true';

    if (force) {
      console.warn('DB_SYNC_FORCE=true: this will drop and recreate all tables.');
    }

    // Default behavior creates missing tables without deleting production data.
    await sequelize.sync({ force, alter });
    await migrateUserRoleToCustomer();
    await migrateUserAvatarColumn();
    await migrateCinemaImageColumn();

    console.log('Database schema synchronized successfully');
    console.log('Database migrations completed');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default runMigrations;
