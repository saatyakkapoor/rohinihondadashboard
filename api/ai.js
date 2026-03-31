module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ error: "Method not allowed, use POST with JSON { prompt }" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const apiKey =
      process.env.GROQ_API_KEY ||
      "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";

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
          temperature: 0.3,
          max_tokens: 1200,
          messages: [
            {
              role: "system",
              content:
                "You are a sharp, numbers-driven executive briefing assistant for a Honda dealership dashboard.",
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    const textBody = await groqRes.text();

    if (!groqRes.ok) {
      return res
        .status(500)
        .json({
          error: `Groq HTTP ${groqRes.status}: ${textBody.slice(0, 200)}`,
        });
    }

    let data;
    try {
      data = JSON.parse(textBody);
    } catch (e) {
      return res.status(500).json({
        error: `Groq returned non-JSON: ${textBody.slice(0, 200)}`,
      });
    }

    const text =
      data.choices?.[0]?.message?.content || "Unable to generate commentary.";

    return res.status(200).json({ text });
  } catch (e) {
    console.error("AI route error", e);
    return res.status(500).json({ error: e.message || "Unknown error" });
  }
};

