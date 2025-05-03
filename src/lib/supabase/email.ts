// ✅ lib/supabase/email.ts
import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient';

const resend = new Resend('re_WQZRvNWN_JUs8MrDunXXvqRTQUEHpbw5z');

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
        <div style="font-family: sans-serif; padding: 20px;">
          <h1 style="color: #1e40af;">Reservation Confirmed</h1>
          <p>Hi <strong>${customerName}</strong>,</p>
          <p>Your reservation for <strong>${partySize}</strong> people on <strong>${reservationDateTime}</strong> has been confirmed at <strong>Sahrati</strong>.</p>
          <p>We look forward to hosting you!</p>
          <p style="margin-top: 24px;">— Sahrati Team</p>
        </div>
      `,
    };
  }

  if (type === 'cancel') {
    return {
      subject: `Your reservation at Sahrati has been cancelled`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1 style="color: #b91c1c;">Reservation Cancelled</h1>
          <p>Hi <strong>${customerName}</strong>,</p>
          <p>We're writing to let you know your reservation on <strong>${reservationDateTime}</strong> has been cancelled.</p>
          <p>If this was unintentional, you're welcome to rebook anytime at <strong>Sahrati</strong>.</p>
          <p style="margin-top: 24px;">— Sahrati Team</p>
        </div>
      `,
    };
  }

  throw new Error('Invalid email type');
}
