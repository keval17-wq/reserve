// src/app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

// POST only
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reservationId, toEmail, customerName, emailType } = body;

    if (!reservationId || !toEmail || !customerName || !emailType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const result = await sendEmail({ reservationId, toEmail, customerName, emailType });
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error('Email route error', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
