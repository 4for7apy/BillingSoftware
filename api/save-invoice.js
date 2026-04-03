export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  const scriptSecret = process.env.GOOGLE_SCRIPT_SECRET;

  if (!scriptUrl || !scriptSecret) {
    res.status(500).json({ ok: false, error: "Server is missing cloud save configuration." });
    return;
  }

  try {
    const targetUrl = new URL(scriptUrl);
    targetUrl.searchParams.set("secret", scriptSecret);

    const upstream = await fetch(targetUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(req.body),
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (_error) {
      data = { ok: false, error: text || "Unexpected response from cloud save target." };
    }

    res.status(upstream.ok ? 200 : 502).json(data);
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || "Cloud save failed." });
  }
}
