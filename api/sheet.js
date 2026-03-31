export default async function handler(req, res) {
  const url =
    "https://docs.google.com/spreadsheets/d/15AB4hbKxEZePHFU9lhzDFt6tO9ZSgVt7Vh9HXgYT2oc/export?format=csv&gid=0";
  try {
    const response = await fetch(url, {
      // Avoid sending any cookies so Google treats this as an anonymous request
      redirect: "follow",
    });

    const text = await response.text();

    // If Google returns a login page (HTML) instead of CSV, fail fast with a clear error
    const ct = response.headers.get("content-type") || "";
    const looksLikeHtml =
      ct.includes("text/html") ||
      text.startsWith("<!DOCTYPE html>") ||
      text.toLowerCase().includes("accounts.google.com");

    if (!response.ok || looksLikeHtml) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res
        .status(500)
        .json({
          error:
            "Google Sheet is not publicly accessible as CSV. Please use 'File → Share → Publish to web' in Google Sheets and use the published CSV URL.",
        });
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(text);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Error fetching Sheet: " + (e.message || String(e)) });
  }
}
