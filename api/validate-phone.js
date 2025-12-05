import { parsePhoneNumberFromString } from "libphonenumber-js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });

  const phoneData = parsePhoneNumberFromString(phone);

  if (!phoneData) {
    return res.status(200).json({
      phone,
      isValid: false,
      message: "Invalid phone number format"
    });
  }

  res.status(200).json({
    phone,
    isValid: phoneData.isValid(),
    country: phoneData.country,
    internationalFormat: phoneData.formatInternational(),
    nationalFormat: phoneData.formatNational()
  });
}
