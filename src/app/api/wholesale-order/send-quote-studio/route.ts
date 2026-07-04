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

function resolveCors(request: NextRequest): {
  allowed: boolean;
  reflectOrigin: string | null;
} {
  const origin = request.headers.get("origin")?.trim();

  if (!origin) {
    return { allowed: true, reflectOrigin: null };
  }

  const allowedOrigins = parseStudioOrigins();
  if (allowedOrigins.includes(origin)) {
    return { allowed: true, reflectOrigin: origin };
  }

  return { allowed: false, reflectOrigin: null };
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

export async function OPTIONS(request: NextRequest) {
  const cors = resolveCors(request);

  if (!cors.allowed) {
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
    return corsJsonResponse(
      { success: false, message: "Origin not allowed." },
      403,
      null
    );
  }

  const secret = process.env.WHOLESALE_SEND_QUOTE_SECRET?.trim();

  if (!secret) {
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
  const sendQuoteUrl = new URL(
    "/api/wholesale-order/send-quote",
    request.nextUrl.origin
  );

  try {
    const upstream = await fetch(sendQuoteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wholesale-send-quote-secret": secret,
      },
      body,
    });

    const data = await upstream.json();
    return corsJsonResponse(data, upstream.status, cors.reflectOrigin);
  } catch (error) {
    console.error("Wholesale send-quote studio proxy error:", error);
    return corsJsonResponse(
      { success: false, message: "Failed to send wholesale quote." },
      500,
      cors.reflectOrigin
    );
  }
}
