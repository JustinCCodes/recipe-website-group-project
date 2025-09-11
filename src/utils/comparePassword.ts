import { scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

/**
 * @param savedHash The hashed password from the database.
 * @param savedSalt The salt from the database.
 * @param suppliedPassword The password from the login form.
 * @returns True if the passwords match, false otherwise.
 */

export default async function comparePassword(
  savedHash: string,
  savedSalt: string,
  suppliedPassword: string
) {
  const suppliedHashBuffer = (await scryptAsync(
    suppliedPassword,
    savedSalt,
    64
  )) as Buffer;

  return suppliedHashBuffer.toString("hex") === savedHash;
}
