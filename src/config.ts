import { config as dotenvConfig } from 'dotenv';
dotenvConfig();


export const config = {
  JWT_TOKEN: process.env.JWT_TOKEN || '',
  NEBULA_DB_MS_URL: process.env.NEBULA_DB_MS_URL || '',
}
