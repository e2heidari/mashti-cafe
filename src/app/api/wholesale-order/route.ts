import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, items, totalAmount, orderNumber } = body;

    // Create email content for wholesale order
    const itemsList = items.map((item: { name: string; weight: string; quantity: number; price: number; total: number }) => 
      `• ${item.name} (${item.weight}) - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)} each - Total: $${item.total.toFixed(2)}`
    ).join('\n');

                    const emailContent = `
New Wholesale Order Request:

Order Number: ${orderNumber}

Customer Information:
Name: ${name}
Email: ${email}
Phone: ${phone}

Order Details:
${itemsList}

Total Amount: $${totalAmount.toFixed(2)}

Additional Message: ${message || 'No additional message provided'}
                `;

    // Check if Resend API key is available
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.WHOLESALE_TO_EMAIL || 'ehsan.heydari@gmail.com';
    const fromEmail = process.env.WHOLESALE_FROM_EMAIL || 'Mashti Wholesale <onboarding@resend.dev>';
    const subjectPrefix = process.env.WHOLESALE_SUBJECT_PREFIX || 'Mashti Wholesale';
    
    console.log('🔍 Environment Check for Wholesale Order:');
    console.log('🔍 RESEND_API_KEY:', resendApiKey ? `${resendApiKey.substring(0, 10)}...` : 'Not set');
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔍 NETLIFY:', process.env.NETLIFY);
    
    if (!resendApiKey || resendApiKey === 'your_resend_api_key_here' || resendApiKey.length < 10) {
      // Fallback: Log the wholesale order data (for development/testing)
      console.log('📧 Wholesale Order Received (API Key Not Set):');
      console.log('To:', toEmail);
      console.log('Subject:', `${subjectPrefix}: ${name}`);
      console.log('Content:', emailContent);
      console.log('');
      console.log('💡 To enable actual email sending:');
      console.log('1. Get your API key from https://resend.com');
      console.log('2. Add RESEND_API_KEY=your_key_here to .env.local');
      console.log('3. For Netlify: Add RESEND_API_KEY in Netlify environment variables');
      console.log('');

      return NextResponse.json({ 
        success: true, 
        message: 'Wholesale order logged successfully! (Email sending not configured - check environment variables)' 
      });
    }

    // If API key is available, send email using Resend
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendApiKey);

      console.log('📧 Attempting to send wholesale order email with Resend...');
      console.log('📧 From: ' + fromEmail);
      console.log('📧 To: ' + toEmail);

      // Send email to the specified address
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `${subjectPrefix}: ${name}`,
        text: emailContent,
                            html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #e80812; margin-bottom: 20px;">New Wholesale Order Request</h2>

                        <div style="background-color: #e80812; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                          <h3 style="margin-bottom: 10px;">Order Number: ${orderNumber}</h3>
                        </div>

                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                          <h3 style="color: #333; margin-bottom: 15px;">Customer Information</h3>
                          <p><strong>Name:</strong> ${name}</p>
                          <p><strong>Email:</strong> ${email}</p>
                          <p><strong>Phone:</strong> ${phone}</p>
                        </div>

                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                          <h3 style="color: #333; margin-bottom: 15px;">Order Details</h3>
                          ${items.map((item: { name: string; weight: string; quantity: number; price: number; total: number }) => `
                            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                              <p><strong>${item.name} (${item.weight})</strong></p>
                              <p>Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)} each | Total: $${item.total.toFixed(2)}</p>
                            </div>
                          `).join('')}
                          <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #e80812;">
                            <p style="font-size: 18px; font-weight: bold; color: #e80812;">
                              Total Amount: $${totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        ${message ? `
                        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                          <h3 style="color: #333; margin-bottom: 15px;">Additional Message</h3>
                          <p>${message}</p>
                        </div>
                        ` : ''}

                        <p style="margin-top: 20px; color: #666; font-size: 14px;">
                          This wholesale order was submitted from the Mashti Cafe website.
                        </p>
                      </div>
                    `,
      });

      if (error) {
        console.error('❌ Resend error for wholesale order:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        return NextResponse.json(
          { success: false, message: `Failed to send email: ${error.message || 'Unknown error'}` },
          { status: 500 }
        );
      }

      console.log('✅ Wholesale order email sent successfully:', data);

      return NextResponse.json({ 
        success: true, 
        message: 'Wholesale order submitted successfully!' 
      });
    } catch (error) {
      console.error('❌ Resend setup error for wholesale order:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return NextResponse.json(
        { success: false, message: `Email service error: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Wholesale Order API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit wholesale order' },
      { status: 500 }
    );
  }
} 