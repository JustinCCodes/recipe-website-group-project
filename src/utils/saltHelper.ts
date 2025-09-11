import crypto from "crypto";

export default function generateSalt() {
  return crypto.randomBytes(16).toString("hex").normalize();
}
