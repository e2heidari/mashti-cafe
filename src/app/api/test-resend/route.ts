import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    
    console.log('🔍 Testing Resend API Key...');
    console.log('🔍 API Key:', resendApiKey ? `${resendApiKey.substring(0, 10)}...` : 'Not set');
    
    if (!resendApiKey) {
      return NextResponse.json({ 
        success: false, 
        message: 'RESEND_API_KEY not found in environment variables' 
      });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    // Test sending a simple email
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'info.yelstar@gmail.com',
      subject: 'Test Email from Mashti Cafe',
      text: 'This is a test email to verify Resend is working.',
    });

    if (error) {
      console.error('❌ Resend test error:', error);
      return NextResponse.json({ 
        success: false, 
        message: `Resend test failed: ${error.message || 'Unknown error'}`,
        error: error
      });
    }

    console.log('✅ Resend test successful:', data);
    return NextResponse.json({ 
      success: true, 
      message: 'Resend API key is working!',
      data: data
    });

  } catch (error) {
    console.error('❌ Resend test setup error:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Resend test setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error
    });
  }
} 