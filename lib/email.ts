import { Resend } from 'resend';
import nodemailer from 'nodemailer';

/**
 * Email transport.
 *
 * - Gmail SMTP (preferred for customer emails): set GMAIL_USER + GMAIL_APP_PASSWORD.
 *   Lets us send to ANY address without owning a custom domain.
 * - Resend (fallback): with the test sender `onboarding@resend.dev` Resend only
 *   delivers to the account owner's address, so it's fine for owner notifications
 *   but NOT for customers until a custom domain is verified (then set RESEND_FROM).
 */
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
const smtp =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      })
    : null;

// Owner notifications always go here
const TO_EMAIL = process.env.OWNER_EMAIL || 'azpilicuetaruben@gmail.com';

async function send(to: string, subject: string, html: string) {
  if (smtp) {
    try {
      await smtp.sendMail({ from: `Vascoco <${GMAIL_USER}>`, to, subject, html });
      return true;
    } catch (err) {
      console.error('Error enviando email por Gmail SMTP:', err);
    }
  }

  if (!resend) {
    console.warn('No hay proveedor de email configurado. No se envió el email.');
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: `Vascoco <${RESEND_FROM}>`,
      to: [to],
      subject,
      html,
    });
    if (error) {
      console.error('Error enviando email con Resend:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Excepción al enviar email:', err);
    return false;
  }
}

export async function sendNotificationEmail(subject: string, htmlBody: string) {
  return send(TO_EMAIL, subject, htmlBody);
}

export async function sendCustomerEmail(to: string, subject: string, htmlBody: string) {
  return send(to, subject, htmlBody);
}
