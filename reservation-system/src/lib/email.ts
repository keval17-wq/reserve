// src/lib/email.ts
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

if (typeof window !== 'undefined') {
  throw new Error('lib/email.ts must run on the server only.');
}

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type Kind = 'confirmation' | 'cancel';

interface SendParams {
  reservationId: string;
  toEmail: string;
  customerName: string;
  reservationDateTime: string;
  persons: number;
  type: Kind;
}

export async function sendReservationEmail({
  reservationId,
  toEmail,
  customerName,
  reservationDateTime,
  persons,
  type,
}: SendParams) {
  const subject =
    type === 'confirmation'
      ? 'Your reservation is confirmed'
      : 'Your reservation has been cancelled';

  const html = `
    <p>Hi ${customerName},</p>
    <p>Your reservation on <strong>${reservationDateTime}</strong>
    for <strong>${persons}</strong> ${
    persons === 1 ? 'person' : 'people'
  } has been
    ${type === 'confirmation' ? 'confirmed' : 'cancelled'}.</p>
    <p>Reservation&nbsp;ID: <code>${reservationId}</code></p>
  `;

  const result = await resend.emails.send({
    from: 'reservations@yourdomain.com',
    to: toEmail,
    subject,
    html,
  });

  await supabaseAdmin.from('emails_log').insert({
    reservation_id: reservationId,
    email_type: type,
    response: result,
  });

  return result;
}
