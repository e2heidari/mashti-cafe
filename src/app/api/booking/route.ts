import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, eventDate, eventType, guestCount, message } = body;

    // Create email content
    const emailContent = `
New Event Booking Request:

Name: ${name}
Email: ${email}
Phone: ${phone}
Event Date: ${eventDate}
Event Type: ${eventType}
Guest Count: ${guestCount}
Message: ${message || 'No additional message provided'}
    `;

    // Check if Resend API key is available
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey || resendApiKey === 'your_resend_api_key_here' || resendApiKey.length < 10) {
      // Fallback: Log the booking data (for development/testing)
      console.log('📧 Booking Request Received (API Key Not Set):');
      console.log('To:', 'info.yelstar@gmail.com');
      console.log('Subject:', `New Event Booking Request - ${name}`);
      console.log('Content:', emailContent);
      console.log('');
      console.log('💡 To enable actual email sending:');
      console.log('1. Get your API key from https://resend.com');
      console.log('2. Add RESEND_API_KEY=your_key_here to .env.local');
      console.log('');

      return NextResponse.json({ 
        success: true, 
        message: 'Booking request logged successfully! (Email sending not configured)' 
      });
    }

    // If API key is available, send email using Resend
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      console.log('📧 Attempting to send email with Resend...');
      console.log('📧 From: onboarding@resend.dev');
      console.log('📧 To: ehsan.heydari@gmail.com');

      // Send email directly to the working address
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'ehsan.heydari@gmail.com',
        subject: `New Event Booking Request - ${name}`,
        text: emailContent,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e80812; margin-bottom: 20px;">New Event Booking Request</h2>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Event Date:</strong> ${eventDate}</p>
              <p><strong>Event Type:</strong> ${eventType}</p>
              <p><strong>Guest Count:</strong> ${guestCount}</p>
              <p><strong>Message:</strong> ${message || 'No additional message provided'}</p>
            </div>
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              This booking request was submitted from the Mashti Cafe website.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error('❌ Resend error:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json(
          { success: false, message: `Failed to send email: ${error.message || 'Unknown error'}` },
          { status: 500 }
        );
      }

      console.log('✅ Email sent successfully:', data);

      return NextResponse.json({ 
        success: true, 
        message: 'Booking request sent successfully!' 
      });
    } catch (error) {
      console.error('❌ Resend setup error:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return NextResponse.json(
        { success: false, message: `Email service error: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Booking API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send booking request' },
      { status: 500 }
    );
  }
} 