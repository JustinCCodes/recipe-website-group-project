import crypto from "crypto";

/**
 * Generates secure random salt
 * @returns 16-byte random salt as hexadecimal string
 * - Salts should be unique per user/password to prevent rainbow table attacks (need to look them up out of interest)
 */

export default function generateSalt() {
  return crypto.randomBytes(16).toString("hex").normalize();
}
