import { NextRequest, NextResponse } from "next/server";

/**
 * Studio-only proxy: attaches WHOLESALE_SEND_QUOTE_SECRET server-side so the
 * secret is not bundled into the Sanity Studio client.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.WHOLESALE_SEND_QUOTE_SECRET?.trim();

  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Send quote is not configured. Set WHOLESALE_SEND_QUOTE_SECRET.",
      },
      { status: 503 }
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
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("Wholesale send-quote studio proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send wholesale quote." },
      { status: 500 }
    );
  }
}
