// src/lib/supabase/email.ts

import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient';

// Initialize Resend with your API key (move this to an env var in production)
const resend = new Resend(process.env.RESEND_API_KEY!);

type EmailType = 'confirmation' | 'cancel';

interface SendEmailProps {
  reservationId: string;
  toEmail: string;
  customerName: string;
  reservationDateTime: string; // e.g. '2025-06-20T18:00'
  partySize: number;
  tableNumber: number;
  type: EmailType;
}

export async function sendEmail({
  reservationId,
  toEmail,
  customerName,
  reservationDateTime,
  partySize,
  tableNumber,
  type,
}: SendEmailProps) {
  // Fetch settings from "email_templates" table, or fallback to defaults
  const settings = await getEmailSettings();

  const { subject, html } = generateEmailTemplate({
    customerName,
    reservationDateTime,
    partySize,
    tableNumber,
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

    // Log success to `emails_log`
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
    // Log failure to `emails_log`
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

/**
 * Fetches email template settings from `email_templates` table.
 * If none found, returns a sensible default.
 */
async function getEmailSettings() {
  const { data, error } = await supabase
    .from('email_templates')
    .select('from_email, subject, body_html')
    .eq('type', 'confirmation') // You could later switch on `type` if storing separate rows
    .limit(1)
    .single();

  if (error || !data) {
    return {
      sender_name: 'Reservo',
      sender_email: 'reservations@rank2revenue.com',
      confirmation_subject: 'Your reservation is confirmed!',
      confirmation_body: `Hi {{name}}, your reservation for {{partySize}} on {{dateTime}} at table {{tableNumber}} is confirmed.`,
      cancel_subject: 'Your reservation has been cancelled',
      cancel_body: `Hi {{name}}, your reservation on {{dateTime}} at table {{tableNumber}} has been cancelled.`,
    };
  }

  return {
    sender_name: 'Reservo',
    sender_email: data.from_email,
    confirmation_subject: data.subject,
    confirmation_body: data.body_html,
    cancel_subject: data.subject,
    cancel_body: data.body_html,
  };
}

function generateEmailTemplate({
  customerName,
  reservationDateTime,
  partySize,
  tableNumber,
  type,
  settings,
}: {
  customerName: string;
  reservationDateTime: string;
  partySize: number;
  tableNumber: number;
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
  const replacements: Record<string, string> = {
    '{{name}}': customerName,
    '{{dateTime}}': reservationDateTime,
    '{{partySize}}': partySize.toString(),
    '{{tableNumber}}': tableNumber.toString(),
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
