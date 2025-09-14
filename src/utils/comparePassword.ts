import { scrypt } from "crypto";
import { promisify } from "util";

// Convert scrypt to return a Promise so can use async/await
const scryptAsync = promisify(scrypt);

/**
 * Compares supplied password with saved hash and salt
 * @param savedHash Hashed password stored in the database
 * @param savedSalt Salt stored in database used to hash the original password
 * @param suppliedPassword Password provided by user during login
 * @returns True if the passwords match false otherwise
 * Hashes the supplied password with saved salt
 * If hash matches saved hash the password is correct
 */
export default async function comparePassword(
  savedHash: string,
  savedSalt: string,
  suppliedPassword: string
) {
  // Hash supplied password using stored salt
  const suppliedHashBuffer = (await scryptAsync(
    suppliedPassword,
    savedSalt,
    64 // Output length in bytes
  )) as Buffer;

  // Convert Buffer to hex string and compare with stored hash
  return suppliedHashBuffer.toString("hex") === savedHash;
}
