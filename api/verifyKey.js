import fs from "fs";
import path from "path";

export function verifyKey(req, res) {
  const providedKey = req.headers["x-api-key"];

  if (!providedKey) {
    res.status(401).json({ error: "API key required" });
    return false;
  }

  // Use process.cwd() instead of relative path
  const keysPath = path.join(process.cwd(), "api/keys.json");

  let data;
  try {
    data = JSON.parse(fs.readFileSync(keysPath, "utf8"));
  } catch (err) {
    res.status(500).json({ error: "Internal server error reading keys.json" });
    return false;
  }

  const user = data.users.find(u => u.key === providedKey);

  if (!user) {
    res.status(403).json({ error: "Invalid API key" });
    return false;
  }

  if (user.usage >= user.limit) {
    res.status(429).json({ error: "API limit reached" });
    return false;
  }

  // Increment usage
  user.usage += 1;
  fs.writeFileSync(keysPath, JSON.stringify(data, null, 2));

  return true;
}
