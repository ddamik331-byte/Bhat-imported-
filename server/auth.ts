import crypto from "crypto";

/**
 * Hash a password using PBKDF2 with SHA-256.
 * This is a simple, synchronous implementation suitable for admin authentication.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha256")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const computedHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha256")
    .toString("hex");

  return computedHash === hash;
}

/**
 * Generate a simple session token for admin authentication.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
