import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/scrape", async (req, res) => {
  const { companyDomain } = req.body;

  if (!companyDomain) {
    return res.status(400).json({ error: "companyDomain is required" });
  }

  try {
    const response = await axios.get("https://api.hunter.io/v2/domain-search", {
      params: {
        domain: companyDomain,
        api_key: process.env.HUNTER_API_KEY,
      },
    });

    // Extract needed info from Hunter response
    const emails = response.data.data.emails || [];

    const employees = emails.map((e) => ({
      email: e.value,
      position: e.position || "Unknown",
      linkedinUrl: e.linkedin || "",
      firstName: e.first_name || "",
      lastName: e.last_name || "",
    }));

    res.json(employees);
  } catch (error) {
    console.error("Hunter API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch from Hunter API" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

