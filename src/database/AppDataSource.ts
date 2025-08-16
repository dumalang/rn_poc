import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Item } from './entities/Item'; // define your entity

export const AppDataSource = new DataSource({
  type: 'react-native',
  database: 'AppDatabase.db',
  location: 'default',
  logging: ['error', 'query', 'schema'],
  synchronize: true,
  entities: [Item], // Add entities here
});

// Helper to always return an initialized DataSource
export const ensureDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
    } catch (e: any) {
      if (e.name !== 'AlreadyHasActiveConnectionError' && !(e.message && e.message.includes('already established'))) {
        throw e;
      }
    }
  }
  return AppDataSource;
};
