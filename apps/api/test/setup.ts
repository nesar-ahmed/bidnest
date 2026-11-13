// Set before dotenv loads .env: existing process.env values win, and tests stay off the real DB.
process.env.NODE_ENV = 'test';
process.env.DATABASE_FILE = ':memory:';
process.env.JWT_SECRET = 'test-only-secret-not-for-production';
process.env.WEB_ORIGIN = 'http://localhost:3000';
