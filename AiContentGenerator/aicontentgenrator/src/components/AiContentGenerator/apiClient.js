
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

// Set to true to run the UI without any API key or network calls —
// useful while wiring up the interface before your key is ready.
const MOCK_MODE = !OPENAI_API_KEY;

function mockDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockGenerate(prompt) {
  await mockDelay(1100 + Math.random() * 700);
  return (
    `[Mock response — add VITE_OPENAI_API_KEY to .env to call a real model]\n\n` +
    `Here's a placeholder result for:\n"${prompt}"\n\n` +
    `Once your key is set, this panel will show the actual generated content ` +
    `instead of this notice.`
  );
}

/**

 * @param {string} prompt - the fully composed prompt to send.
 * @returns {Promise<string>} the generated text.
 */
export async function generateContent(prompt) {
  if (MOCK_MODE) {
    return mockGenerate(prompt);
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a concise, high-quality content generator. Write only the requested content, no preamble.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Request failed (${response.status}): ${errText || response.statusText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("No content returned by the API.");
  return text.trim();
}

/* ---------------------------------------------------------------------
   Using Anthropic's Messages API instead of OpenAI:

   const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

   const response = await fetch(ANTHROPIC_URL, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
       "anthropic-version": "2023-06-01",
     },
     body: JSON.stringify({
       model: "claude-sonnet-4-6",
       max_tokens: 500,
       messages: [{ role: "user", content: prompt }],
     }),
   });
   const data = await response.json();
   const text = data.content?.[0]?.text;

   Note: Anthropic's API does not send permissive CORS headers for
   browser requests, so this call must go through your own backend
   proxy rather than running directly in the browser.
--------------------------------------------------------------------- */