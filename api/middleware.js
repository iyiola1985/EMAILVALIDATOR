import fs from "fs";

// Middleware to verify API keys
export function verifyKey(req, res) {
  const rapidApiKey = req.headers["x-rapidapi-key"];
  const privateKey = req.headers["x-api-key"];

  // 1. Allow RapidAPI users (you can set your RapidAPI key in environment variables)
  if (rapidApiKey && rapidApiKey === process.env.RAPIDAPI_KEY) {
    return true;
  }

  // 2. Allow private users
  if (privateKey) {
    const keysFile = "keys.json"; // JSON file storing private keys
    let keys = [];

    try {
      keys = JSON.parse(fs.readFileSync(keysFile));
    } catch {
      return res.status(500).json({ error: "Keys database error" });
    }

    const user = keys.find((k) => k.key === privateKey);

    if (!user) {
      return res.status(403).json({ error: "Invalid private API key" });
    }

    if (user.used >= user.limit) {
      return res
        .status(429)
        .json({ error: "Request limit reached for this key" });
    }

    // Increment usage
    user.used++;
    fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));
    return true;
  }

  // No valid key provided
  return res.status(401).json({ error: "API key required" });
}
