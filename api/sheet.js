export default async function handler(req, res) {
  const url =
    "https://docs.google.com/spreadsheets/d/15AB4hbKxEZePHFU9lhzDFt6tO9ZSgVt7Vh9HXgYT2oc/export?format=csv&gid=0";

  try {
    const response = await fetch(url, {
      redirect: "follow",
    });

    const text = await response.text();

    // Very minimal login-page detection: only fail if we clearly see a Google
    // Accounts login marker in the body. Some public CSV exports may still use
    // text/html as content-type, so we *cannot* rely on that header.
    const looksLikeLogin = text.toLowerCase().includes("accounts.google.com");

    if (looksLikeLogin) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(500).json({
        error:
          "Google Sheet is not returning CSV (HTML/login detected). Please ensure the Sheet is published or shared publicly.",
      });
    }

    // Otherwise forward the CSV (even if status code is non-200 but body is CSV)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(text);
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res
      .status(500)
      .json({ error: "Error fetching Sheet: " + (e.message || String(e)) });
  }
}
