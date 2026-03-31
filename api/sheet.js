export default async function handler(req, res) {
  // Direct CSV export URL (already downloads as CSV when opened in browser)
  const url =
    "https://docs.google.com/spreadsheets/d/15AB4hbKxEZePHFU9lhzDFt6tO9ZSgVt7Vh9HXgYT2oc/export?format=csv&gid=0";

  try {
    const response = await fetch(url, {
      // Treat as a simple anonymous request
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res
        .status(500)
        .json({ error: "Failed to fetch CSV from Google Sheets." });
    }

    // Get raw bytes and forward as CSV so browser can download it
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "text/csv; charset=utf-8"
    );
    // Hint browser to download as a file instead of trying to render
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="sheet-export.csv"'
    );

    return res.status(200).send(buffer);
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res
      .status(500)
      .json({ error: "Error fetching Sheet: " + (e.message || String(e)) });
  }
}
