import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const ENCRYPTION_KEY = Buffer.from(
  process.env.SEARCH_HISTORY_ENCRYPTION_KEY!,
  "base64"
);

const IV_LENGTH = 16;

/**
 * Encrypts a text string with AES-256-GCM
 * Returns string containing the IV, authentication tag, and ciphertext
 * @param {string} text The text to encrypt
 * @returns {string} Encrypted string in format iv:authTag:encrypted
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString(
    "hex"
  )}`;
}

/**
 * Decrypts a string previously encrypted with encrypt()
 * @param {string} hash Encrypted string in format iv:authTag:encrypted
 * @returns {string} Decrypted text or [decryption failed] if invalid
 */
export function decrypt(hash: string): string {
  try {
    const [ivHex, authTagHex, encryptedHex] = hash.split(":");
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error("Invalid encrypted text format");
    }
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption failed:", error);
    return "[decryption failed]";
  }
}

/**
 * Generates a SHA-256 hash of query string
 * @param {string} text - Input text
 * @returns {string} - Hexadecimal SHA-256 hash
 */
export function hashQuery(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}
