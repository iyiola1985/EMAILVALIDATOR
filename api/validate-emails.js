import validator from "validator";
import dns from "dns";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const isValidFormat = validator.isEmail(email);
  let hasMX = false;
  const domain = email.split("@")[1];

  try {
    const records = await new Promise((resolve) => {
      dns.resolveMx(domain, (err, addresses) => {
        if (err) resolve([]);
        else resolve(addresses);
      });
    });

    hasMX = records.length > 0;
  } catch {
    hasMX = false;
  }

  res.status(200).json({
    email,
    validFormat: isValidFormat,
    hasMXRecord: hasMX,
    isValid: isValidFormat && hasMX,
  });
}
