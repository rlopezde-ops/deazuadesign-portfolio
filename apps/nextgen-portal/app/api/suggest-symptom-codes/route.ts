import { NextRequest, NextResponse } from "next/server";

const SYMPTOM_CODES = [
  { code: "LCD-001", label: "LCD / display damage" },
  { code: "BAT-002", label: "Battery degradation" },
  { code: "CHG-003", label: "Charging system failure" },
  { code: "CAM-004", label: "Camera module fault" },
  { code: "PWR-005", label: "Power management fault" },
  { code: "LIQ-006", label: "Liquid ingress damage" },
  { code: "GLS-007", label: "Glass / cover damage" },
  { code: "SPK-008", label: "Speaker / mic failure" },
  { code: "SW-009",  label: "Software / firmware issue" },
];

export async function POST(req: NextRequest) {
  const { description, deviceMake, deviceModel, issueIds } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const codeList = SYMPTOM_CODES.map((s) => `${s.code}: ${s.label}`).join("\n");
  const issueContext = issueIds?.length ? `\nSelected issue tags: ${issueIds.join(", ")}` : "";
  const deviceContext = [deviceMake, deviceModel].filter(Boolean).join(" ");

  const userMessage = `Device: ${deviceContext || "unknown"}${issueContext}

Problem description: "${description}"

Based on the above, which symptom codes best match? Return ONLY a JSON array of matching code strings (e.g. ["LCD-001", "BAT-002"]). Include all that clearly apply. If nothing matches, return the 1-2 most likely codes.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: `You are a repair diagnostics assistant for a uBreakiFix store. Given a device problem description, you identify the matching symptom codes from this list:\n\n${codeList}\n\nRespond ONLY with a valid JSON array of code strings. No explanation, no markdown, just the array.`,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: err }, { status: response.status });
  }

  const data = await response.json();
  const text: string = data.content?.[0]?.text ?? "[]";

  let codes: string[] = [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      const validCodes = new Set(SYMPTOM_CODES.map((s) => s.code));
      codes = parsed.filter((c: unknown) => typeof c === "string" && validCodes.has(c));
    }
  } catch {
    codes = [];
  }

  return NextResponse.json({ codes });
}
