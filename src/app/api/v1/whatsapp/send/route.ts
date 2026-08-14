import { NextRequest, NextResponse } from 'next/server';

/**
 * CISEM Green API proxy sender and status handler endpoint.
 */
export async function POST(req: NextRequest) {
  try {
    const { to, text, idInstance, apiTokenInstance } = await req.json();

    if (!to || !text) {
      return NextResponse.json({ error: 'Missing required message parameters' }, { status: 400 });
    }

    // Fall back to mock simulation mode when instances are omitted
    if (!idInstance || !apiTokenInstance) {
      return NextResponse.json({ 
        success: true, 
        mock: true, 
        message: 'Simulation log record spawned successfully.' 
      });
    }

    // Format phone contact
    const cleanPhone = to.replace(/[+\s-]/g, '');
    const greenApiUrl = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const response = await fetch(greenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: `${cleanPhone}@c.us`,
        message: text
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Green API endpoint failed: ${errorText}` }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idInstance = searchParams.get('idInstance');
    const apiTokenInstance = searchParams.get('apiTokenInstance');

    if (!idInstance || !apiTokenInstance) {
      return NextResponse.json({ status: 'offline', message: 'Credentials missing' });
    }

    const greenApiUrl = `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;
    const response = await fetch(greenApiUrl);

    if (!response.ok) {
      return NextResponse.json({ status: 'offline', error: 'Failed to fetch status from Green API' });
    }

    const data = await response.json();
    return NextResponse.json({ status: data.stateInstance || 'unknown', data });
  } catch (err: any) {
    return NextResponse.json({ status: 'offline', error: err.message }, { status: 500 });
  }
}
