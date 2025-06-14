import axios from "axios";

const HUNTER_API_URL = "https://api.hunter.io/v2/domain-search";

export async function fetchFromHunter(companyDomain) {
  try {
    const response = await axios.get(HUNTER_API_URL, {
      params: {
        domain: companyDomain,
        api_key: process.env.HUNTER_API_KEY,
      },
    });

    console.log("Hunter.io Response:", response.data);
    return response.data.data.emails.map((email) => ({
      email: email.value,
      position: email.position || "Unknown",
    }));
  } catch (error) {
    console.error("Error fetching from Hunter.io:", error.response?.data || error.message);
    return [];
  }
}
