import { config } from 'dotenv';
config();
const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('No mongodb uri');
}

export default { PORT, MONGODB_URI };
