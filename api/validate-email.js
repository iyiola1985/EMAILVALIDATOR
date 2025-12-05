import validator from "validator";
import { verifyKey } from "./verifyKey.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (!verifyKey(req, res)) return;

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const isValidFormat = validator.isEmail(email);

  // Skip MX check for now
  res.status(200).json({
    email,
    validFormat: isValidFormat,
    hasMXRecord: null,
    isValid: isValidFormat
  });
}
