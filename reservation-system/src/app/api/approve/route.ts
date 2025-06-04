// src/app/api/approve/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendReservationEmail } from '@/lib/email';

interface ApproveRequestBody {
  reservationId: string;
  customerEmail: string;
  customerName: string;
  reservationDateTime: string; // e.g. '2025-06-20T18:00'
  persons: number;
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  ok: true;
}

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const body = (await req.json()) as Partial<ApproveRequestBody>;

    const {
      reservationId,
      customerEmail,
      customerName,
      reservationDateTime,
      persons,
    } = body;

    if (
      !reservationId ||
      !customerEmail ||
      !customerName ||
      !reservationDateTime ||
      typeof persons !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    // Update reservation status to 'confirmed'
    const { error: updateErr } = await supabase
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', reservationId);

    if (updateErr) {
      throw new Error(`Supabase update failed: ${updateErr.message}`);
    }

    // Send confirmation email
    await sendReservationEmail({
      reservationId,
      toEmail: customerEmail,
      customerName,
      reservationDateTime,
      persons,
      type: 'confirmation',
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Approve API error:', error);

    const message =
      error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
