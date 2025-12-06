const BASE_URL = "https://emailvalidator-livid.vercel.app/api";
const API_KEY = "abcd1234"; // YOUR KEY

async function validateEmail() {
  const email = document.getElementById("email").value;

  try {
    const res = await fetch(`${BASE_URL}/validate-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    document.getElementById("result").textContent = JSON.stringify(
      data,
      null,
      2
    );
  } catch (err) {
    console.error("ERROR:", err);
    document.getElementById("result").textContent = "Request failed";
  }
}

async function validatePhone() {
  const phone = document.getElementById("phone").value;

  try {
    const res = await fetch(`${BASE_URL}/validate-phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
    document.getElementById("result").textContent = JSON.stringify(
      data,
      null,
      2
    );
  } catch (err) {
    console.error("ERROR:", err);
    document.getElementById("result").textContent = "Request failed";
  }
}
