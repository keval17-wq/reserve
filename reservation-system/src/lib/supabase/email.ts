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
  businessId?: string; // Optional, for multi-tenant future use
}

export async function sendEmail({
  reservationId,
  toEmail,
  customerName,
  reservationDateTime,
  partySize,
  type,
  businessId = 'default', // fallback for now
}: SendEmailProps) {
  const settings = await getEmailSettings(businessId);
  const { subject, html } = generateEmailTemplate({
    customerName,
    reservationDateTime,
    partySize,
    type,
    settings,
  });

  try {
    const response = await resend.emails.send({
      from: `${settings.sender_name} <${settings.sender_email}>`,
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
  } catch (error) {
    const err = error as Error;
    await supabase.from('emails_log').insert({
      reservation_id: reservationId,
      to_email: toEmail,
      type,
      status: 'failed',
      response_info: { error: err.message },
    });

    return { success: false, error: err.message };
  }
}

async function getEmailSettings(businessId: string) {
  const { data, error } = await supabase
    .from('email_settings')
    .select('*')
    .eq('business_id', businessId)
    .single();

  if (error || !data) {
    // Default fallback
    return {
      sender_name: 'Reservo',
      sender_email: 'reservations@rank2revenue.com',
      confirmation_subject: 'Your reservation is confirmed!',
      confirmation_body: `Hi {{name}}, your reservation for {{partySize}} on {{date}} is confirmed.`,
      cancel_subject: 'Your reservation has been cancelled',
      cancel_body: `Hi {{name}}, your reservation on {{date}} has been cancelled.`,
    };
  }

  return data;
}

function generateEmailTemplate({
  customerName,
  reservationDateTime,
  partySize,
  type,
  settings,
}: {
  customerName: string;
  reservationDateTime: string;
  partySize: number;
  type: EmailType;
  settings: {
    sender_name: string;
    sender_email: string;
    confirmation_subject: string;
    confirmation_body: string;
    cancel_subject: string;
    cancel_body: string;
  };
}) {
  const replacements = {
    '{{name}}': customerName,
    '{{date}}': reservationDateTime,
    '{{partySize}}': partySize.toString(),
  };

  const replacePlaceholders = (text: string) =>
    Object.entries(replacements).reduce(
      (acc, [key, val]) => acc.replace(new RegExp(key, 'g'), val),
      text
    );

  if (type === 'confirmation') {
    return {
      subject: replacePlaceholders(settings.confirmation_subject),
      html: `<div style="font-family: sans-serif; padding: 20px;">
          ${replacePlaceholders(settings.confirmation_body)}
        </div>`,
    };
  }

  if (type === 'cancel') {
    return {
      subject: replacePlaceholders(settings.cancel_subject),
      html: `<div style="font-family: sans-serif; padding: 20px;">
          ${replacePlaceholders(settings.cancel_body)}
        </div>`,
    };
  }

  throw new Error('Invalid email type');
}
