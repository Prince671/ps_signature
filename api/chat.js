import { GoogleGenAI } from "@google/genai";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const MAX_INPUT_LENGTH = 16_000;
const MAX_REQUESTS_PER_MINUTE = 10;
const requestCounts = new Map();

function jsonResponse(response, status, body) {
  response.setHeader("Cache-Control", "no-store");
  return response.status(status).json(body);
}

function isSameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;

  try {
    const requestOrigin = new URL(origin);
    const requestHost = request.headers.host;
    const forwardedProtocol = request.headers["x-forwarded-proto"]
      ?.split(",")[0]
      ?.trim();

    return (
      requestOrigin.host === requestHost &&
      (!forwardedProtocol || requestOrigin.protocol === `${forwardedProtocol}:`)
    );
  } catch {
    return false;
  }
}

function isRateLimited(request) {
  const now = Date.now();
  const forwardedFor = request.headers["x-forwarded-for"];
  const clientId =
    request.headers["x-real-ip"]?.trim() ||
    forwardedFor?.split(",").at(-1)?.trim() ||
    "unknown";
  const windowStart = now - 60_000;

  if (requestCounts.size > 1_000) {
    for (const [key, timestamps] of requestCounts) {
      if (timestamps.every((timestamp) => timestamp <= windowStart)) {
        requestCounts.delete(key);
      }
      if (requestCounts.size <= 800) break;
    }
  }

  const recentRequests = (requestCounts.get(clientId) || []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    requestCounts.set(clientId, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestCounts.set(clientId, recentRequests);
  return false;
}

async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse(request, 405, { code: "METHOD_NOT_ALLOWED", message: "Use POST." });
  }

  if (!isSameOrigin(request)) {
    return jsonResponse(request, 403, { code: "ORIGIN_NOT_ALLOWED", message: "Request origin is not allowed." });
  }

  if (isRateLimited(request)) {
    return jsonResponse(request, 429, { code: "PROVIDER_RATE_LIMITED", message: "Too many chat requests. Try again shortly." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse(request, 503, { code: "CHAT_NOT_CONFIGURED", message: "The chat service is not configured." });
  }

  let payload = request.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return jsonResponse(request, 400, { code: "INVALID_REQUEST", message: "Request body must be valid JSON." });
    }
  }

  const input = typeof payload?.input === "string" ? payload.input.trim() : "";
  if (!input || input.length > MAX_INPUT_LENGTH) {
    return jsonResponse(request, 400, {
      code: "INVALID_INPUT",
      message: `Message must contain 1 to ${MAX_INPUT_LENGTH} characters.`,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: input,
      config: { maxOutputTokens: 700 },
    });
    const answer = result.text?.trim();

    if (!answer) {
      return jsonResponse(request, 502, { code: "EMPTY_MODEL_RESPONSE", message: "The AI returned an empty response." });
    }

    return jsonResponse(request, 200, { output_text: answer });
  } catch (error) {
    const status = Number(error?.status || error?.statusCode);

    if (status === 404) {
      return jsonResponse(request, 502, { code: "PROVIDER_MODEL_UNAVAILABLE", message: "The configured AI model is unavailable." });
    }
    if (status === 401 || status === 403) {
      return jsonResponse(request, 502, { code: "PROVIDER_AUTH_FAILED", message: "The AI provider rejected the server credentials." });
    }
    if (status === 429) {
      return jsonResponse(request, 429, { code: "PROVIDER_RATE_LIMITED", message: "The AI provider is rate-limiting requests." });
    }

    console.error("Gemini chat request failed:", error?.message || "Unknown provider error");
    return jsonResponse(request, 502, { code: "PROVIDER_REQUEST_FAILED", message: "The AI provider could not complete the request." });
  }
}

export default handler;
