import { parsePhoneNumberFromString } from "libphonenumber-js";

export default async function handler(req, res) {

  // --------------------------
  // CORS HEADERS
  // --------------------------
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const phoneData = parsePhoneNumberFromString(phone);

  if (!phoneData) {
    return res.json({
      phone,
      isValid: false,
      message: "Invalid phone number format",
    });
  }

  res.json({
    phone,
    isValid: phoneData.isValid(),
    country: phoneData.country,
    internationalFormat: phoneData.formatInternational(),
    nationalFormat: phoneData.formatNational(),
  });
}
