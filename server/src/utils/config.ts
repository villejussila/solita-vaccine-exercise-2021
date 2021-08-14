import { config } from 'dotenv';
config();
const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;

const MONGODB_URI =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'teste2e'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('No mongodb uri');
}

export default { PORT, MONGODB_URI };
