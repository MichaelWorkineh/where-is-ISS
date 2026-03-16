export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544"
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ISS data" });
  }
}