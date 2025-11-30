const express = require("express");
const validator = require("validator");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
const dns = require("dns");

const app = express();
app.use(express.json());

// ----------------------------
// EMAIL VALIDATOR
// ----------------------------
app.post("/validate-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Basic format validation
  const isValidFormat = validator.isEmail(email);

  // Check MX records (mail server)
  let hasMX = false;
  const domain = email.split("@")[1];

  try {
    const records = await new Promise((resolve, reject) => {
      dns.resolveMx(domain, (err, addresses) => {
        if (err) resolve([]);
        else resolve(addresses);
      });
    });

    hasMX = records.length > 0;
  } catch {
    hasMX = false;
  }

  res.json({
    email,
    validFormat: isValidFormat,
    hasMXRecord: hasMX,
    isValid: isValidFormat && hasMX,
  });
});

// ----------------------------
// PHONE VALIDATOR
// ----------------------------
app.post("/validate-phone", (req, res) => {
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
});

// ----------------------------
// START SERVER
// ----------------------------
app.listen(4000, () => {
  console.log("Validator API running on port 4000");
});
