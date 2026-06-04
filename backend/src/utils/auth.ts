import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const BCRYPT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(userId: string, expiresIn: string = '7d'): string {
  return jwt.sign(
    {
      id: userId,
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): { id: string; iat: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; iat: number };
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Decode JWT token without verification (for debugging)
 */
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
}
