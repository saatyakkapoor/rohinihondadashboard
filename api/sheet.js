export default async function handler(req, res) {
  // Direct CSV export URL (already downloads as CSV when opened in browser)
  const url =
    "https://docs.google.com/spreadsheets/d/15AB4hbKxEZePHFU9lhzDFt6tO9ZSgVt7Vh9HXgYT2oc/export?format=csv&gid=0";

  // Just redirect the client to Google's export URL.
  // This makes the browser behave exactly like when you open the URL directly,
  // and avoids any server-side fetch / auth issues.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(302, {
    Location: url,
  });
  res.end();
}
