// lib/email.ts
import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

// ensure this file is only executed on the server
if (typeof window !== 'undefined') {
  throw new Error('lib/email.ts should never be imported on the client');
}

type EmailType = 'confirmation' | 'cancel';

interface SendEmailProps {
  reservationId: string;
  toEmail: string;
  customerName: string;
  emailType: EmailType;
}

export async function sendEmail({
  reservationId,
  toEmail,
  customerName,
  emailType,
}: SendEmailProps) {
  // fetch template (or hard-code if you like)
  const { data: tmpl } = await supabase
    .from('email_templates')
    .select('from_email, subject, body_html')
    .eq('type', emailType)
    .single();

  if (!tmpl) throw new Error('Email template not found');

  // simple token replace
  const html = tmpl.body_html
    .replace(/{{name}}/g, customerName)
    .replace(/{{reservationId}}/g, reservationId);

  const result = await resend.emails.send({
    from: tmpl.from_email,
    to: [toEmail],
    subject: tmpl.subject,
    html,
  });

  // optional logging
  await supabase.from('emails_log').insert({
    reservation_id: reservationId,
    email_type: emailType,
    response: result,
  });

  return result;
}
