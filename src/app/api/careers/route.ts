import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Invalid content type" },
        { status: 400 }
      );
    }

    const form = await request.formData();
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const phone = String(form.get("phone") || "");
    const position = String(form.get("position") || "");
    const location = String(form.get("location") || "");
    const linkedin = String(form.get("linkedin") || "");
    const message = String(form.get("message") || "");
    const resume = form.get("resume") as File | null;

    if (!name || !email || !phone || !position || !resume) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate resume file
    if (!resume) {
      return NextResponse.json(
        { success: false, message: "Resume file is required" },
        { status: 400 }
      );
    }
    if (resume.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Resume file too large (max 5MB)" },
        { status: 400 }
      );
    }

    const arrayBuffer = await resume.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CAREERS_TO_EMAIL || "mashticafevancouver@gmail.com";
    const fromEmail = process.env.CAREERS_FROM_EMAIL || "Mashti Careers <onboarding@resend.dev>";
    const subjectPrefix = process.env.CAREERS_SUBJECT_PREFIX || "Mashti Careers";
    const isEmailEnabled = Boolean(resendApiKey);

    const subject = `${subjectPrefix}: ${position} — ${name}`;
    const text = `New career application\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPosition: ${position}\nLocation: ${location}\nLinkedIn: ${linkedin}\n\nMessage:\n${message}`;

    if (!isEmailEnabled) {
      console.warn("[Careers] Email disabled (RESEND_API_KEY missing). Payload:", {
        name,
        email,
        phone,
        position,
        location,
        linkedin,
        messageLength: message.length,
        resumeName: resume.name,
        resumeType: resume.type,
        resumeSize: resume.size,
      });
      return NextResponse.json({ success: true, message: "Received (email disabled in this environment)" });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey!);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
      replyTo: email,
      attachments: [
        {
          filename: resume.name,
          content: bytes, // Buffer is supported
          contentType: resume.type || "application/octet-stream",
        },
      ],
    });

    if (error) {
      console.error("Careers email error:", error);
      return NextResponse.json(
        { success: false, message: `Failed to send application: ${error?.message || "unknown"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Careers submission error:", err);
    return NextResponse.json(
      { success: false, message: "Unexpected error" },
      { status: 500 }
    );
  }
}


