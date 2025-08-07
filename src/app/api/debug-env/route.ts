import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envVars = {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      NETLIFY: process.env.NETLIFY,
      // Add other relevant env vars
    };

    console.log('🔍 Environment Variables Check:', envVars);

    return NextResponse.json({ 
      success: true, 
      message: 'Environment variables check',
      environment: envVars,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Debug env error:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error: error
    });
  }
} 