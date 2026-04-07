import { Resend } from "resend";
import { format } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Split It Gold Coast <brett@splitithire.com.au>";
const REPLY_TO = "brett@splitithire.com.au";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://splitit.com.au";

function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f0; margin: 0; padding: 20px; }
  .container { max-width: 560px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .header { background: #245824; color: white; padding: 24px 32px; }
  .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .header p { margin: 4px 0 0; font-size: 13px; color: #a3c9a3; }
  .body { padding: 28px 32px; color: #1a1a1a; font-size: 15px; line-height: 1.6; }
  .body h2 { font-size: 17px; font-weight: 700; margin: 0 0 16px; }
  .info-box { background: #f2f7f2; border: 1px solid #c0d8c0; border-radius: 8px; padding: 16px; margin: 16px 0; }
  .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e0ead0; font-size: 14px; }
  .info-row:last-child { border-bottom: none; }
  .info-label { color: #666; }
  .info-value { font-weight: 600; }
  .cta-btn { display: inline-block; background: #e07020; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; margin: 16px 0; }
  .footer { background: #f0efe9; padding: 20px 32px; font-size: 12px; color: #888; }
  .footer a { color: #555; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Split It Gold Coast</h1>
    <p>Hydraulic Log Splitter Hire — Mudgeeraba, QLD</p>
  </div>
  <div class="body">${body}</div>
  <div class="footer">
    <p>Split It Gold Coast &nbsp;|&nbsp; Mudgeeraba QLD 4213 &nbsp;|&nbsp; ABN: 43 762 412 524</p>
    <p>Questions? Email <a href="mailto:brett@splitithire.com.au">brett@splitithire.com.au</a> or call 0414 601 836</p>
    <p>All prices include GST.</p>
  </div>
</div>
</body>
</html>`;
}

export interface BookingEmailData {
  id: string;
  customerName: string;
  customerEmail: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  hireType: string;
  hireFeeTotal: number;
  deliveryFee: number;
  bondAmount: number;
  totalCharged: number;
  deliveryOption: string;
  deliveryAddress?: string | null;
  pickupSuburb?: string;
}

export async function sendBookingConfirmation(booking: BookingEmailData) {
  const startFmt = format(booking.startDate, "EEEE d MMMM yyyy");
  const endFmt = format(booking.endDate, "EEEE d MMMM yyyy");
  const pickupInfo =
    booking.deliveryOption === "delivery"
      ? `Delivery to ${booking.deliveryAddress}`
      : `Self-collection from ${booking.pickupSuburb || "Mudgeeraba"} (full address sent 24 hrs before pickup)`;

  const body = `
<h2>You're booked! 🪵</h2>
<p>Hi ${booking.customerName},</p>
<p>Your log splitter hire is confirmed. Here's your booking summary:</p>

<div class="info-box">
  <div class="info-row"><span class="info-label">Booking Reference</span><span class="info-value">${booking.id}</span></div>
  <div class="info-row"><span class="info-label">Start Date</span><span class="info-value">${startFmt}</span></div>
  <div class="info-row"><span class="info-label">Return Date</span><span class="info-value">${endFmt}</span></div>
  <div class="info-row"><span class="info-label">Hire Days</span><span class="info-value">${booking.numberOfDays} day${booking.numberOfDays !== 1 ? "s" : ""}</span></div>
  <div class="info-row"><span class="info-label">Collection</span><span class="info-value">${pickupInfo}</span></div>
  <div class="info-row"><span class="info-label">Hire Fee</span><span class="info-value">$${booking.hireFeeTotal.toFixed(2)}</span></div>
  ${booking.deliveryFee > 0 ? `<div class="info-row"><span class="info-label">Delivery Fee</span><span class="info-value">$${booking.deliveryFee.toFixed(2)}</span></div>` : ""}
  <div class="info-row"><span class="info-label">Total Charged</span><span class="info-value">$${booking.totalCharged.toFixed(2)}</span></div>
  <div class="info-row"><span class="info-label">Security Bond (held)</span><span class="info-value">$${booking.bondAmount.toFixed(2)}</span></div>
</div>

<p><strong>What happens next:</strong></p>
<ul>
<li>You'll receive a reminder email 24 hours before your pickup date with the full collection address.</li>
<li>On pickup day, complete the condition checklist on your phone — link will be in your reminder.</li>
<li>Return the machine clean and with a full tank of fuel by 5:00 PM on the return date.</li>
</ul>

<p><strong>What to bring at pickup:</strong></p>
<ul>
<li>This confirmation (on your phone is fine)</li>
<li>Your driver's licence</li>
<li>A vehicle capable of transporting the machine</li>
</ul>

<a class="cta-btn" href="${SITE_URL}/terms">View Terms of Hire</a>

<p>Any questions? Reply to this email or call <strong>0414 601 836</strong>.</p>
<p>Thanks for booking with us!</p>`;

  await resend.emails.send({
    from: FROM,
    to: booking.customerEmail,
    replyTo: REPLY_TO,
    subject: `You're booked! Log Splitter Hire — ${format(booking.startDate, "d MMM")} to ${format(booking.endDate, "d MMM yyyy")}`,
    html: baseTemplate("Booking Confirmation", body),
  });
}

export async function sendPickupReminder(booking: BookingEmailData & { pickupAddress: string; pickupChecklistUrl: string }) {
  const startFmt = format(booking.startDate, "EEEE d MMMM yyyy");

  const body = `
<h2>Tomorrow's the day! 🪵</h2>
<p>Hi ${booking.customerName},</p>
<p>Your log splitter hire starts <strong>tomorrow, ${startFmt}</strong>. Here are your pickup details:</p>

<div class="info-box">
  <div class="info-row"><span class="info-label">Pickup Address</span><span class="info-value">${booking.pickupAddress}</span></div>
  <div class="info-row"><span class="info-label">Pickup Window</span><span class="info-value">8:00 AM – 5:00 PM</span></div>
  <div class="info-row"><span class="info-label">Return Date</span><span class="info-value">${format(booking.endDate, "d MMMM yyyy")} by 5:00 PM</span></div>
</div>

<p><strong>Before you leave with the machine:</strong></p>
<p>Please complete the pickup condition checklist on your phone. This records the machine's condition at the start of your hire and protects both of us.</p>

<a class="cta-btn" href="${booking.pickupChecklistUrl}">Complete Pickup Checklist</a>

<p><strong>Quick-start tips:</strong></p>
<ul>
<li>Check oil and hydraulic fluid before starting</li>
<li>Warm the machine up for 2–3 minutes before splitting</li>
<li>Use horizontal mode for logs under 400mm, vertical for larger rounds</li>
<li>Never put your hands in the splitting zone while the machine is operating</li>
</ul>

<p>Questions on the day? Call <strong>0414 601 836</strong>.</p>`;

  await resend.emails.send({
    from: FROM,
    to: booking.customerEmail,
    replyTo: REPLY_TO,
    subject: `Tomorrow's the day! Pickup details for your log splitter hire`,
    html: baseTemplate("Pickup Reminder", body),
  });
}

export async function sendReturnReminder(booking: BookingEmailData & { returnChecklistUrl: string }) {
  const body = `
<h2>Return day — here's what you need to know 🪵</h2>
<p>Hi ${booking.customerName},</p>
<p>Today is the last day of your hire. The machine needs to be returned by <strong>5:00 PM today</strong>.</p>

<p><strong>Return instructions:</strong></p>
<ul>
<li>Return to the same address you picked up from</li>
<li>Ensure the machine is clean (remove bark, sawdust, debris)</li>
<li>Fill the tank with regular unleaded petrol before returning</li>
<li>Complete the return condition checklist below</li>
</ul>

<a class="cta-btn" href="${booking.returnChecklistUrl}">Complete Return Checklist</a>

<p><strong>Bond release:</strong> Once we've checked the machine, we'll release your $${booking.bondAmount.toFixed(2)} bond hold. You'll receive a confirmation email.</p>

<p>We hope the splitting went well! If you had a great experience, we'd love a Google review — it helps a lot for a small local business.</p>
<a href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" style="color:#245824;font-weight:600">Leave a Google Review →</a>`;

  await resend.emails.send({
    from: FROM,
    to: booking.customerEmail,
    replyTo: REPLY_TO,
    subject: `Return day — here's what you need to know`,
    html: baseTemplate("Return Reminder", body),
  });
}

export async function sendBondReleased(booking: BookingEmailData) {
  const body = `
<h2>Your bond has been released ✅</h2>
<p>Hi ${booking.customerName},</p>
<p>Great news — your $${booking.bondAmount.toFixed(2)} security bond hold has been released. No funds were charged.</p>
<p>Your bank may take 3–5 business days to clear the hold from your statement, depending on your financial institution.</p>
<p>Thanks for taking good care of the machine and for being a great customer.</p>

<p>We'd love a Google review if you haven't left one already — it means a lot to a small local business.</p>
<a class="cta-btn" href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK">Leave a Google Review</a>

<p>Hope to see you again next time!</p>`;

  await resend.emails.send({
    from: FROM,
    to: booking.customerEmail,
    replyTo: REPLY_TO,
    subject: `Your bond has been released — thanks for hiring with us!`,
    html: baseTemplate("Bond Released", body),
  });
}

export async function sendBondCaptured(
  booking: BookingEmailData,
  captureAmount: number,
  reason: string
) {
  const body = `
<h2>Update on your security bond</h2>
<p>Hi ${booking.customerName},</p>
<p>We need to let you know that <strong>$${captureAmount.toFixed(2)}</strong> has been captured from your security bond.</p>

<div class="info-box">
  <div class="info-row"><span class="info-label">Amount Captured</span><span class="info-value">$${captureAmount.toFixed(2)}</span></div>
  <div class="info-row"><span class="info-label">Reason</span><span class="info-value">${reason}</span></div>
</div>

<p>If you have any questions or would like to discuss this, please contact us directly:</p>
<ul>
<li>Email: <a href="mailto:brett@splitithire.com.au">brett@splitithire.com.au</a></li>
<li>Phone: 0414 601 836</li>
</ul>`;

  await resend.emails.send({
    from: FROM,
    to: booking.customerEmail,
    replyTo: REPLY_TO,
    subject: `Update on your security bond`,
    html: baseTemplate("Bond Update", body),
  });
}

export async function sendFollowUp(booking: BookingEmailData) {
  const body = `
<h2>How did the log splitting go? 🪵</h2>
<p>Hi ${booking.customerName},</p>
<p>We hope you got through all that wood! Just checking in after your hire.</p>
<p>If you haven't already, we'd really appreciate a Google review — it helps other Gold Coast locals find us, and means the world to a small local business.</p>

<a class="cta-btn" href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK">Leave a Google Review</a>

<p>Need the machine again? We're always available to book online:</p>
<a href="${SITE_URL}/book" style="color:#245824;font-weight:600">Book your next hire →</a>

<p>Thanks again,<br>Split It Gold Coast</p>`;

  await resend.emails.send({
    from: FROM,
    to: booking.customerEmail,
    replyTo: REPLY_TO,
    subject: `How did the log splitting go?`,
    html: baseTemplate("Follow-up", body),
  });
}

export async function notifyOwnerReturn(booking: BookingEmailData) {
  const ownerEmail = process.env.OWNER_EMAIL || process.env.RESEND_FROM_EMAIL || REPLY_TO;

  const body = `
<h2>Return checklist submitted</h2>
<p>Booking ${booking.id} has submitted their return checklist.</p>
<div class="info-box">
  <div class="info-row"><span class="info-label">Customer</span><span class="info-value">${booking.customerName}</span></div>
  <div class="info-row"><span class="info-label">Dates</span><span class="info-value">${format(booking.startDate, "d MMM")} – ${format(booking.endDate, "d MMM yyyy")}</span></div>
  <div class="info-row"><span class="info-label">Bond</span><span class="info-value">$${booking.bondAmount.toFixed(2)} held</span></div>
</div>
<a class="cta-btn" href="${SITE_URL}/admin/bookings/${booking.id}">View Booking &amp; Manage Bond</a>`;

  await resend.emails.send({
    from: FROM,
    to: ownerEmail,
    subject: `Machine returned — action required for booking ${booking.id}`,
    html: baseTemplate("Return Notification", body),
  });
}
