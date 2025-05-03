// lib/supabase/email.ts
import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailType = 'confirmation' | 'cancel';

interface SendEmailProps {
  reservationId: string;
  toEmail: string;
  customerName: string;
  reservationDateTime: string;
  partySize: number;
  type: EmailType;
}

export async function sendEmail({
  reservationId,
  toEmail,
  customerName,
  reservationDateTime,
  partySize,
  type,
}: SendEmailProps) {
  const { subject, html } = generateEmailTemplate({
    customerName,
    reservationDateTime,
    partySize,
    type,
  });

  try {
    const response = await resend.emails.send({
      from: 'Sahrati <reservations@sahrati.com>',
      to: toEmail,
      subject,
      html,
    });

    await supabase.from('emails_log').insert({
      reservation_id: reservationId,
      to_email: toEmail,
      type,
      status: 'sent',
      response_info: response,
    });

    return { success: true };
  } catch (error: any) {
    await supabase.from('emails_log').insert({
      reservation_id: reservationId,
      to_email: toEmail,
      type,
      status: 'failed',
      response_info: { error: error.message },
    });

    return { success: false, error: error.message };
  }
}

function generateEmailTemplate({
  customerName,
  reservationDateTime,
  partySize,
  type,
}: {
  customerName: string;
  reservationDateTime: string;
  partySize: number;
  type: EmailType;
}) {
  if (type === 'confirmation') {
    return {
      subject: `Your reservation at Sahrati is confirmed!`,
      html: `
        <h1>Reservation Confirmed</h1>
        <p>Hi ${customerName},</p>
        <p>Your reservation for ${partySize} people on ${reservationDateTime} has been confirmed at Sahrati.</p>
        <p>We look forward to serving you!</p>
      `,
    };
  }

  if (type === 'cancel') {
    return {
      subject: `Your reservation at Sahrati has been cancelled`,
      html: `
        <h1>Reservation Cancelled</h1>
        <p>Hi ${customerName},</p>
        <p>We regret to inform you that your reservation on ${reservationDateTime} has been cancelled.</p>
        <p>If this was unintentional, feel free to rebook anytime.</p>
      `,
    };
  }

  throw new Error('Invalid email type');
}
