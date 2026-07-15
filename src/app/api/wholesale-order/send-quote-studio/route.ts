import { NextRequest, NextResponse } from "next/server";

/**
 * Studio-only proxy: attaches WHOLESALE_SEND_QUOTE_SECRET server-side so the
 * secret is not bundled into the Sanity Studio client.
 */
function parseStudioOrigins(): string[] {
  const raw = process.env.SANITY_STUDIO_ORIGIN?.trim();
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

type CorsDecision = {
  allowed: boolean;
  reflectOrigin: string | null;
  denyReason:
    | "missing_origin"
    | "empty_allowlist"
    | "origin_not_in_allowlist"
    | null;
};

function resolveCors(request: NextRequest): CorsDecision {
  const allowedOrigins = parseStudioOrigins();
  const origin = request.headers.get("origin")?.trim() || null;
  const requestOrigin = new URL(request.url).origin;

  // Embedded Studio on the same deployed host (e.g. /studio → /api).
  if (origin && origin === requestOrigin) {
    return { allowed: true, reflectOrigin: origin, denyReason: null };
  }

  if (!origin) {
    return {
      allowed: false,
      reflectOrigin: null,
      denyReason: "missing_origin",
    };
  }

  if (allowedOrigins.length === 0) {
    return {
      allowed: false,
      reflectOrigin: null,
      denyReason: "empty_allowlist",
    };
  }

  if (allowedOrigins.includes(origin)) {
    return { allowed: true, reflectOrigin: origin, denyReason: null };
  }

  return {
    allowed: false,
    reflectOrigin: null,
    denyReason: "origin_not_in_allowlist",
  };
}

function logCorsDenial(request: NextRequest, cors: CorsDecision): void {
  const origin = request.headers.get("origin")?.trim() || null;
  const requestOrigin = new URL(request.url).origin;
  const allowlist = parseStudioOrigins();

  console.warn("Wholesale send-quote-studio origin denied", {
    origin,
    originMissing: !origin,
    requestOrigin,
    allowlist,
    matched: false,
    denyReason: cors.denyReason,
    sameOriginWouldMatch: Boolean(origin && origin === requestOrigin),
  });
}

function corsHeaders(reflectOrigin: string | null): HeadersInit {
  if (!reflectOrigin) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": reflectOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function corsJsonResponse(
  body: unknown,
  status: number,
  reflectOrigin: string | null
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: corsHeaders(reflectOrigin),
  });
}

function errorNameMessage(error: unknown): { name: string; message: string } {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { name: "UnknownError", message: String(error) };
}

function parseUpstreamBody(rawText: string): {
  data: unknown;
  message: string | null;
} {
  if (!rawText.trim()) {
    return { data: null, message: null };
  }

  try {
    const data = JSON.parse(rawText) as unknown;
    const message =
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : null;
    return { data, message };
  } catch {
    console.warn("Wholesale send-quote-studio non-JSON upstream body", {
      rawPreview: rawText.slice(0, 200),
    });
    return {
      data: {
        success: false,
        message: "Downstream returned a non-JSON response.",
      },
      message: "Downstream returned a non-JSON response.",
    };
  }
}

export async function OPTIONS(request: NextRequest) {
  const cors = resolveCors(request);

  if (!cors.allowed) {
    logCorsDenial(request, cors);
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(cors.reflectOrigin),
  });
}

export async function POST(request: NextRequest) {
  const cors = resolveCors(request);

  if (!cors.allowed) {
    logCorsDenial(request, cors);
    return corsJsonResponse(
      { success: false, message: "Origin not allowed." },
      403,
      null
    );
  }

  const secretConfigured = Boolean(
    process.env.WHOLESALE_SEND_QUOTE_SECRET?.trim()
  );
  const secret = process.env.WHOLESALE_SEND_QUOTE_SECRET?.trim();

  if (!secret) {
    console.error("Wholesale send-quote-studio misconfigured", {
      secretConfigured: false,
      downstreamUrl: null,
    });
    return corsJsonResponse(
      {
        success: false,
        message:
          "Send quote is not configured. Set WHOLESALE_SEND_QUOTE_SECRET.",
      },
      503,
      cors.reflectOrigin
    );
  }

  const body = await request.text();
  // Same request origin as the Studio proxy (embedded or allowlisted).
  const sendQuoteUrl = new URL(
    "/api/wholesale-order/send-quote",
    request.url
  ).toString();

  try {
    const upstream = await fetch(sendQuoteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wholesale-send-quote-secret": secret,
      },
      body,
    });

    const rawText = await upstream.text();
    const { data, message } = parseUpstreamBody(rawText);

    console.info("Wholesale send-quote-studio upstream response", {
      downstreamUrl: sendQuoteUrl,
      downstreamStatus: upstream.status,
      downstreamMessage: message,
      secretConfigured,
    });

    if (data == null) {
      return corsJsonResponse(
        {
          success: false,
          message:
            upstream.ok
              ? "Downstream returned an empty response."
              : `Downstream request failed (${upstream.status}).`,
        },
        upstream.status || 502,
        cors.reflectOrigin
      );
    }

    return corsJsonResponse(data, upstream.status, cors.reflectOrigin);
  } catch (error) {
    const { name, message } = errorNameMessage(error);
    console.error("Wholesale send-quote studio proxy fetch failed", {
      downstreamUrl: sendQuoteUrl,
      secretConfigured,
      errorName: name,
      errorMessage: message,
    });
    return corsJsonResponse(
      {
        success: false,
        message: `Failed to reach send-quote endpoint: ${message}`,
      },
      502,
      cors.reflectOrigin
    );
  }
}
