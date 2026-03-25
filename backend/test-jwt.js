import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET || 'sundrip_secret_1234';

console.log('Secret:', secret);

const userId = '123456789012345678901234';
const token = jwt.sign({ userId }, secret, {
  expiresIn: '30d',
});

console.log('Token:', token);

try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded:', decoded);
} catch (error) {
  console.error('Verify Event Error:', error);
}
