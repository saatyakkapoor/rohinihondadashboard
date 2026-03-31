export default async function handler(req, res) {
  const url = 'https://docs.google.com/spreadsheets/d/15AB4hbKxEZePHFU9lhzDFt6tO9ZSgVt7Vh9HXgYT2oc/export?format=csv&gid=0';
  try {
    const response = await fetch(url);
    const csv = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(csv);
  } catch (e) {
    res.status(500).send('Error: ' + e.message);
  }
}
