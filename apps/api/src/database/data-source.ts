import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { typeormOptions } from './typeorm.config';

export const AppDataSource = new DataSource(typeormOptions());
