import crypto from "crypto";

/**
 * Hashes a password using the scrypt key function
 * @param password Password to hash
 * @param salt Unique salt string used to make hash unique
 * @returns Promise that resolves to hexadecimal hash of password
 * Hash length is set to 64 bytes for strong security
 */

export default function hashPassword(password: string, salt: string) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
      if (error) reject(error);
      resolve(hash.toString("hex").normalize());
    });
  });
}
