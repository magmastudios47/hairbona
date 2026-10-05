import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const SITE_URL = 'https://vascoco.vercel.app';

// Vascoco design tokens (email-safe hex values)
const C = {
  bg: '#0B1A14',
  card: '#122B22',
  cardBorder: '#1E3F33',
  ivory: '#F4EFE6',
  ivoryMuted: '#B9B3A6',
  gold: '#C6A664',
  goldSoft: '#2A2B1E',
  divider: '#24463A',
};

const FONT_HEADING = "'Playfair Display', Georgia, 'Times New Roman', serif";
const FONT_BODY = "Montserrat, 'Helvetica Neue', Helvetica, Arial, sans-serif";

function esc(s: string | null | undefined) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absUrl(url: string | null | undefined) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function money(n: number | null | undefined) {
  if (n == null) return '';
  return `$${Number(n).toLocaleString('es-AR')} ARS`;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export interface BookingEmailData {
  appointmentId: string;
  customerName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  serviceName: string;
  duration: number;
  price: number | null;
  barberName: string;
  barberPhoto: string | null;
  address?: string | null;
}

export function bookingConfirmationEmail(d: BookingEmailData) {
  const [y, m, day] = d.date.split('-').map(Number);
  const dateObj = new Date(y, m - 1, day);
  const dateLabel = format(dateObj, "EEEE, d 'de' MMMM", { locale: es });
  const firstName = (d.customerName || '').trim().split(/\s+/)[0] || 'Hola';
  const ref = d.appointmentId.slice(-8).toUpperCase();
  const address = d.address?.trim() || 'Junín de los Andes, Neuquén';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Vascoco Barbería ${address}`)}`;

  const [sh, sm] = d.startTime.split(':').map(Number);
  const [eh, em] = d.endTime.split(':').map(Number);
  const calStart = `${y}${pad(m)}${pad(day)}T${pad(sh)}${pad(sm)}00`;
  const calEnd = `${y}${pad(m)}${pad(day)}T${pad(eh)}${pad(em)}00`;
  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(`${d.serviceName} en Vascoco`)}` +
    `&dates=${calStart}/${calEnd}` +
    `&ctz=America/Argentina/Buenos_Aires` +
    `&details=${encodeURIComponent(`Turno con ${d.barberName}. Ref: ${ref}\n${SITE_URL}`)}` +
    `&location=${encodeURIComponent(address)}`;

  const heroImg = absUrl(d.barberPhoto) || `${SITE_URL}/images/logo-circle.png`;
  const logoImg = `${SITE_URL}/images/logo-circle.png`;

  const actionBtn = (href: string, icon: string, label: string) => `
    <td align="center" valign="top" width="33%" style="padding:0 4px;">
      <a href="${href}" target="_blank" style="text-decoration:none;color:${C.ivory};">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
          <tr><td align="center" valign="middle" width="48" height="48" style="width:48px;height:48px;border-radius:24px;background:${C.card};border:1px solid ${C.cardBorder};font-size:20px;line-height:48px;">${icon}</td></tr>
        </table>
        <div style="font-family:${FONT_BODY};font-size:12px;color:${C.ivory};margin-top:10px;line-height:16px;">${label}</div>
      </a>
    </td>`;

  const subject = `Tu turno en Vascoco está confirmado · ${format(dateObj, "d 'de' MMMM", { locale: es })}, ${d.startTime} hs`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(`${d.serviceName} con ${d.barberName} — ${dateLabel} a las ${d.startTime} hs.`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:28px;">
    <img src="${logoImg}" width="64" height="64" alt="Vascoco" style="display:block;border-radius:32px;border:0;">
    <div style="font-family:${FONT_HEADING};font-size:13px;letter-spacing:6px;color:${C.gold};margin-top:12px;text-transform:uppercase;">Vascoco</div>
  </td></tr>

  <!-- Headline -->
  <tr><td align="center" style="font-family:${FONT_HEADING};font-size:30px;line-height:38px;color:${C.ivory};font-weight:700;padding:0 8px;">
    Hola, ${esc(firstName)}: tu turno está<br><span style="color:${C.gold};">confirmado</span>
  </td></tr>

  <!-- Image -->
  <tr><td align="center" style="padding:28px 0 20px;">
    <img src="${esc(heroImg)}" width="128" height="128" alt="${esc(d.barberName)}" style="display:block;width:128px;height:128px;object-fit:cover;border-radius:16px;border:1px solid ${C.cardBorder};">
  </td></tr>

  <!-- Place + date -->
  <tr><td align="center" style="font-family:${FONT_BODY};color:${C.ivory};padding:0 12px;">
    <div style="font-size:17px;font-weight:700;line-height:24px;">Vascoco Barbería · ${esc(address)}</div>
    <div style="font-size:15px;line-height:22px;color:${C.ivoryMuted};margin-top:4px;">el ${esc(dateLabel)} a las ${esc(d.startTime)} hs</div>
  </td></tr>

  <!-- Quick actions -->
  <tr><td style="padding:28px 0 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      ${actionBtn(calendarUrl, '&#128197;', 'Añadir al<br>calendario')}
      ${actionBtn(mapsUrl, '&#128205;', 'Cómo<br>llegar')}
      ${actionBtn(SITE_URL, '&#128136;', 'Visitar<br>Vascoco')}
    </tr></table>
  </td></tr>

  <!-- Manage button -->
  <tr><td style="padding-bottom:28px;">
    <a href="${SITE_URL}/perfil" target="_blank" style="display:block;text-align:center;background:${C.card};border:1px solid ${C.cardBorder};border-radius:999px;padding:15px 20px;font-family:${FONT_BODY};font-size:14px;font-weight:700;color:${C.ivory};text-decoration:none;letter-spacing:0.5px;">Gestionar turno</a>
  </td></tr>

  <!-- Booking details card -->
  <tr><td style="background:${C.card};border:1px solid ${C.cardBorder};border-radius:20px;padding:24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="background:${C.gold};border-radius:999px;padding:7px 16px;font-family:${FONT_BODY};font-size:12px;font-weight:700;color:${C.bg};">&#10003;&nbsp; Confirmado</td>
    </tr></table>
    <div style="font-family:${FONT_HEADING};font-size:20px;font-weight:700;color:${C.ivory};margin:20px 0 18px;">Datos del turno</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:${FONT_BODY};">
      <tr>
        <td valign="top" style="font-size:15px;line-height:21px;color:${C.ivory};padding-right:12px;">${esc(d.serviceName)}</td>
        <td valign="top" align="right" style="font-size:15px;line-height:21px;color:${C.ivory};white-space:nowrap;">${esc(money(d.price))}</td>
      </tr>
      <tr><td colspan="2" style="font-size:13px;color:${C.ivoryMuted};padding-top:4px;">${d.duration} min con ${esc(d.barberName)}</td></tr>
      <tr><td colspan="2" style="padding:18px 0;"><div style="height:1px;background:${C.divider};line-height:1px;font-size:1px;">&nbsp;</div></td></tr>
      <tr>
        <td style="font-size:15px;font-weight:700;color:${C.ivory};">Total</td>
        <td align="right" style="font-size:15px;font-weight:700;color:${C.gold};white-space:nowrap;">${esc(money(d.price))}</td>
      </tr>
      <tr><td colspan="2" style="padding:18px 0;"><div style="height:1px;background:${C.divider};line-height:1px;font-size:1px;">&nbsp;</div></td></tr>
      <tr><td colspan="2" style="font-size:13px;color:${C.ivoryMuted};">Ref. de la reserva: ${ref}</td></tr>
    </table>
  </td></tr>

  <tr><td style="height:20px;line-height:20px;font-size:1px;">&nbsp;</td></tr>

  <!-- Location card -->
  <tr><td style="background:${C.card};border:1px solid ${C.cardBorder};border-radius:20px;padding:24px;">
    <div style="font-family:${FONT_HEADING};font-size:20px;font-weight:700;color:${C.ivory};margin-bottom:16px;">Ubicación</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:${FONT_BODY};"><tr>
      <td valign="top" style="padding-right:12px;">
        <div style="font-size:15px;line-height:21px;color:${C.ivory};">Vascoco Barbería</div>
        <div style="font-size:13px;line-height:19px;color:${C.ivoryMuted};margin-top:2px;">${esc(address)}</div>
      </td>
      <td valign="top" align="right" width="64">
        <img src="${logoImg}" width="56" height="56" alt="Vascoco" style="display:block;border-radius:12px;border:0;">
      </td>
    </tr></table>
    <a href="${mapsUrl}" target="_blank" style="display:inline-block;margin-top:18px;border:1px solid ${C.cardBorder};border-radius:999px;padding:10px 18px;font-family:${FONT_BODY};font-size:13px;color:${C.ivory};text-decoration:none;">Ver en el mapa &nbsp;&#8594;</a>
  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding:32px 12px 0;font-family:${FONT_BODY};font-size:12px;line-height:18px;color:${C.ivoryMuted};">
    Si no podés asistir, cancelá tu turno desde <a href="${SITE_URL}/perfil" style="color:${C.gold};text-decoration:none;">tu perfil</a> para liberar el horario.<br><br>
    <a href="https://www.instagram.com/vascoco.be" style="color:${C.gold};text-decoration:none;">@vascoco.be</a> &nbsp;·&nbsp; <a href="${SITE_URL}" style="color:${C.gold};text-decoration:none;">vascoco.vercel.app</a><br>
    &copy; ${new Date().getFullYear()} Vascoco · Barbería Exclusiva
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, html };
}

export function cancellationEmail(d: BookingEmailData, isForOwner: boolean = false) {
  const [y, m, day] = d.date.split('-').map(Number);
  const dateObj = new Date(y, m - 1, day);
  const dateLabel = format(dateObj, "EEEE, d 'de' MMMM", { locale: es });
  const firstName = (d.customerName || '').trim().split(/\s+/)[0] || 'Hola';
  const ref = d.appointmentId.slice(-8).toUpperCase();

  const heroImg = absUrl(d.barberPhoto) || `${SITE_URL}/images/logo-circle.png`;
  const logoImg = `${SITE_URL}/images/logo-circle.png`;

  const subject = isForOwner 
    ? `❌ Turno Cancelado: ${d.customerName}` 
    : `Tu turno en Vascoco ha sido cancelado`;

  const headline = isForOwner 
    ? `Turno de ${esc(firstName)}<br><span style="color:#e74c3c;">Cancelado</span>`
    : `Hola, ${esc(firstName)}: tu turno fue<br><span style="color:#e74c3c;">cancelado</span>`;

  const actionBtn = (href: string, icon: string, label: string) => `
    <td align="center" valign="top" width="50%" style="padding:0 4px;">
      <a href="${href}" target="_blank" style="text-decoration:none;color:${C.ivory};">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
          <tr><td align="center" valign="middle" width="48" height="48" style="width:48px;height:48px;border-radius:24px;background:${C.card};border:1px solid ${C.cardBorder};font-size:20px;line-height:48px;">${icon}</td></tr>
        </table>
        <div style="font-family:${FONT_BODY};font-size:12px;color:${C.ivory};margin-top:10px;line-height:16px;">${label}</div>
      </a>
    </td>`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(`Turno cancelado: ${d.serviceName} con ${d.barberName} — ${dateLabel} a las ${d.startTime} hs.`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:28px;">
    <img src="${logoImg}" width="64" height="64" alt="Vascoco" style="display:block;border-radius:32px;border:0;">
    <div style="font-family:${FONT_HEADING};font-size:13px;letter-spacing:6px;color:${C.gold};margin-top:12px;text-transform:uppercase;">Vascoco</div>
  </td></tr>

  <!-- Headline -->
  <tr><td align="center" style="font-family:${FONT_HEADING};font-size:30px;line-height:38px;color:${C.ivory};font-weight:700;padding:0 8px;">
    ${headline}
  </td></tr>

  <!-- Image -->
  <tr><td align="center" style="padding:28px 0 20px;">
    <img src="${esc(heroImg)}" width="128" height="128" alt="${esc(d.barberName)}" style="display:block;width:128px;height:128px;object-fit:cover;border-radius:16px;border:1px solid ${C.cardBorder};opacity:0.7;filter:grayscale(100%);">
  </td></tr>

  <!-- Place + date -->
  <tr><td align="center" style="font-family:${FONT_BODY};color:${C.ivory};padding:0 12px;">
    <div style="font-size:17px;font-weight:700;line-height:24px;">${isForOwner ? 'Detalles del turno' : 'El turno que tenías para'}</div>
    <div style="font-size:15px;line-height:22px;color:${C.ivoryMuted};margin-top:4px;">el ${esc(dateLabel)} a las ${esc(d.startTime)} hs</div>
  </td></tr>

  <!-- Quick actions -->
  ${!isForOwner ? `
  <tr><td style="padding:28px 0 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      ${actionBtn(SITE_URL + '/reservar', '&#128197;', 'Sacar otro<br>turno')}
      ${actionBtn(SITE_URL, '&#128136;', 'Visitar<br>Vascoco')}
    </tr></table>
  </td></tr>
  ` : ''}

  <!-- Booking details card -->
  <tr><td style="background:${C.card};border:1px solid ${C.cardBorder};border-radius:20px;padding:24px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="background:#e74c3c;border-radius:999px;padding:7px 16px;font-family:${FONT_BODY};font-size:12px;font-weight:700;color:${C.ivory};">&#10007;&nbsp; Cancelado</td>
    </tr></table>
    <div style="font-family:${FONT_HEADING};font-size:20px;font-weight:700;color:${C.ivory};margin:20px 0 18px;">Datos del turno</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:${FONT_BODY};">
      <tr>
        <td valign="top" style="font-size:15px;line-height:21px;color:${C.ivory};padding-right:12px;">${esc(d.serviceName)}</td>
        <td valign="top" align="right" style="font-size:15px;line-height:21px;color:${C.ivory};white-space:nowrap;">${esc(money(d.price))}</td>
      </tr>
      <tr><td colspan="2" style="font-size:13px;color:${C.ivoryMuted};padding-top:4px;">${d.duration} min con ${esc(d.barberName)}</td></tr>
      <tr><td colspan="2" style="padding:18px 0;"><div style="height:1px;background:${C.divider};line-height:1px;font-size:1px;">&nbsp;</div></td></tr>
      <tr>
        <td style="font-size:15px;font-weight:700;color:${C.ivory};">Teléfono</td>
        <td align="right" style="font-size:15px;font-weight:700;color:${C.gold};white-space:nowrap;">${esc(isForOwner && (d as any).customerPhone ? (d as any).customerPhone : '')}</td>
      </tr>
      <tr><td colspan="2" style="padding:18px 0;"><div style="height:1px;background:${C.divider};line-height:1px;font-size:1px;">&nbsp;</div></td></tr>
      <tr><td colspan="2" style="font-size:13px;color:${C.ivoryMuted};">Ref. de la reserva: ${ref}</td></tr>
    </table>
  </td></tr>

  <tr><td style="height:20px;line-height:20px;font-size:1px;">&nbsp;</td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding:32px 12px 0;font-family:${FONT_BODY};font-size:12px;line-height:18px;color:${C.ivoryMuted};">
    <a href="https://www.instagram.com/vascoco.be" style="color:${C.gold};text-decoration:none;">@vascoco.be</a> &nbsp;·&nbsp; <a href="${SITE_URL}" style="color:${C.gold};text-decoration:none;">vascoco.vercel.app</a><br>
    &copy; ${new Date().getFullYear()} Vascoco · Barbería Exclusiva
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, html };
}
