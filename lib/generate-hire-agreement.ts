import PDFDocument from "pdfkit";
import { format } from "date-fns";

const GREEN = "#245824";
const LIGHT_GREEN = "#f2f7f2";
const AMBER = "#d97706";
const AMBER_BG = "#fffbeb";
const DARK = "#1a1a1a";
const MID = "#555555";
const BORDER = "#c0d8c0";

export interface HireAgreementData {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  hireType: string;
  totalCharged: number;
  signatureDataUrl: string;
  termsAcceptedAt: Date;
}

const CLAUSES: [string, string, string[]][] = [
  [
    "1. Parties",
    'These Terms of Hire ("Terms") govern the hire of equipment between Split It Gold Coast ABN: 43 762 412 524 ("Owner") and the person who has submitted a booking ("Hirer").',
    [],
  ],
  [
    "2. Equipment",
    "The equipment hired is a hydraulic log splitter including safety accessories as specified in the booking confirmation. The Hirer accepts the equipment in the condition documented at pickup.",
    [],
  ],
  [
    "3. Safety Instructions and Manufacturer's Guide",
    "Prior to hire, the Owner provides the Hirer with access to the manufacturer's operating instructions and safety procedures for the equipment. By completing this booking the Hirer acknowledges that:",
    [
      "They have been provided with, and have reviewed, the manufacturer's user guide and safety instructions for the log splitter (available at splitithire.com.au/guide)",
      "They understand the safe operating procedures for the equipment before use",
      "They will operate the equipment strictly in accordance with those instructions",
      "They will ensure any other person who operates the equipment during the hire period has also reviewed the safety instructions",
    ],
  ],
  [
    "4. Hirer's Responsibilities",
    "The Hirer is responsible for:",
    [
      "Safe operation of the equipment at all times",
      "Compliance with all applicable laws and safety standards",
      "Ensuring equipment is used only for its intended purpose (log splitting)",
      "Keeping the equipment secure during the hire period",
      "Returning the equipment clean, with a full tank of fuel, on the agreed return date",
    ],
  ],
  [
    "5. Permitted and Prohibited Use",
    "Permitted: Domestic log splitting for personal use. Prohibited: Sub-hire to a third party; use for commercial purposes without prior written consent; use by anyone other than the Hirer or persons authorised by the Owner; transport of the equipment outside Queensland.",
    [],
  ],
  [
    "6. Damage and Loss",
    "The Hirer is liable for any damage to, or loss of, the equipment during the hire period (including loading, transport, and unloading). Damage includes any damage beyond normal wear and tear. The Owner will assess damage on return using the condition checklists completed at pickup and return. Repair or replacement costs will be deducted from the security bond, with any excess invoiced to the Hirer.",
    [],
  ],
  [
    "7. Security Bond",
    "A security bond of $500 AUD is placed as a pre-authorisation hold on the Hirer's nominated card at the time of booking. This is NOT a charge — no funds are collected unless damage, late return, or fuel levies apply. If the machine is returned in good condition, on time, and with a full tank, the bond hold is released within 2 business days of return. The Hirer acknowledges the bond hold may appear as a pending transaction on their bank statement during this period.",
    [],
  ],
  [
    "8. Late Return",
    "If the equipment is not returned by 5:00 PM on the agreed return date, the Hirer will incur an additional charge equal to the applicable daily hire rate for each day (or part thereof) of delay, captured from the security bond or invoiced directly.",
    [],
  ],
  [
    "9. Fuel Policy",
    "The equipment is provided with a full tank of fuel (regular unleaded petrol). It must be returned with a full tank. If returned with less than a full tank, a minimum fuel levy of $25 applies and will be captured from the security bond.",
    [],
  ],
  [
    "10. Cancellation Policy",
    "Full refund: cancellations received 48 hours or more before the hire start time. 50% refund: cancellations received between 24 and 48 hours before hire start. No refund: cancellations received within 24 hours of hire start. The security bond hold is always released immediately upon cancellation.",
    [],
  ],
  [
    "11. Delivery and Collection",
    "Where delivery is selected, the Owner or a nominated representative will deliver and collect the equipment within the agreed time window. The Hirer must ensure safe, clear access to the delivery location. Delivery fees are non-refundable.",
    [],
  ],
  [
    "12. Insurance",
    "The Owner maintains public liability insurance covering the equipment during periods it is under the Owner's custody. The Hirer is responsible for any damage caused to third-party property while the equipment is in the Hirer's possession. The Hirer's personal contents or vehicle insurance may be relevant — the Hirer should confirm their own coverage.",
    [],
  ],
  [
    "13. Indemnity",
    "The Hirer indemnifies the Owner against any claim, loss, damage, liability, or expense arising from the Hirer's use of the equipment, including personal injury to the Hirer or any third party.",
    [],
  ],
  [
    "14. Minimum Age",
    "The Hirer must be 18 years of age or older. By accepting these Terms, the Hirer confirms they are at least 18 years of age.",
    [],
  ],
  [
    "15. Privacy",
    "The Hirer's personal information (including photo ID) is collected for identity verification and hire agreement purposes only. It is stored securely and is not shared with third parties except where required by law.",
    [],
  ],
  [
    "16. Governing Law",
    "These Terms are governed by the laws of Queensland, Australia. Any disputes will be subject to the jurisdiction of the courts of Queensland.",
    [],
  ],
  [
    "17. Entire Agreement",
    "These Terms, together with the booking confirmation, constitute the entire agreement between the parties and supersede all prior negotiations, representations, or agreements.",
    [],
  ],
];

export async function generateHireAgreementPdf(data: HireAgreementData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 20, bottom: 20, left: 28, right: 28 },
      info: {
        Title: "Hire Agreement — Split It Gold Coast",
        Author: "Split It Gold Coast",
        Subject: `Booking ${data.bookingId}`,
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const W = doc.page.width - 56; // content width (margins 28 each side)
    const L = 28; // left margin

    // ── Header bar ──────────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 58).fill(GREEN);
    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("Split It Gold Coast", L, 14);
    doc
      .fillColor("#a3c9a3")
      .font("Helvetica")
      .fontSize(9)
      .text("Hydraulic Log Splitter Hire  |  Mudgeeraba, QLD  |  ABN: 43 762 412 524", L, 37);

    doc.moveDown(0.3);

    // ── Document title ───────────────────────────────────────────────────────
    const afterHeader = 66;
    doc
      .fillColor(GREEN)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Hire Agreement — Signed Copy", L, afterHeader);
    doc
      .fillColor(MID)
      .font("Helvetica")
      .fontSize(8.5)
      .text("Terms of Hire — Last updated: April 2026", L, afterHeader + 15);

    // horizontal rule
    doc
      .moveTo(L, afterHeader + 28)
      .lineTo(L + W, afterHeader + 28)
      .strokeColor(BORDER)
      .lineWidth(0.5)
      .stroke();

    // ── Booking summary box ──────────────────────────────────────────────────
    const boxY = afterHeader + 34;
    doc.rect(L, boxY, W, 48).fill(LIGHT_GREEN).stroke(BORDER);

    const col = W / 3;
    const fields = [
      ["Booking ID", data.bookingId.slice(0, 12) + "…"],
      ["Hire Dates", `${format(data.startDate, "d MMM")} – ${format(data.endDate, "d MMM yyyy")}`],
      ["Customer", data.customerName],
      ["Days", `${data.numberOfDays} day${data.numberOfDays !== 1 ? "s" : ""} (${data.hireType})`],
      ["Total Charged", `$${data.totalCharged.toFixed(2)} AUD`],
      ["Email", data.customerEmail],
    ];

    fields.forEach(([label, value], i) => {
      const col_x = L + (i % 3) * col + 5;
      const row_y = boxY + (i < 3 ? 5 : 27);
      doc.fillColor(MID).font("Helvetica").fontSize(7).text(label, col_x, row_y, { width: col - 8 });
      doc.fillColor(DARK).font("Helvetica-Bold").fontSize(8).text(value, col_x, row_y + 9, { width: col - 8 });
    });

    // ── Terms clauses ─────────────────────────────────────────────────────────
    doc.y = boxY + 56;

    for (const [heading, body, bullets] of CLAUSES) {
      doc
        .fillColor(GREEN)
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .text(heading, L, doc.y, { width: W });

      doc
        .fillColor(DARK)
        .font("Helvetica")
        .fontSize(8)
        .text(body, L, doc.y + 1, { width: W, align: "justify" });

      for (const b of bullets) {
        doc
          .fillColor(DARK)
          .font("Helvetica")
          .fontSize(8)
          .text(`•  ${b}`, L + 10, doc.y + 1, { width: W - 10 });
      }

      doc.moveDown(0.35);
    }

    // ── Signature section ────────────────────────────────────────────────────
    // If we're close to the bottom, add a new page
    if (doc.y > doc.page.height - 140) {
      doc.addPage();
    }

    const sigY = doc.y + 4;

    // Amber acceptance box
    doc.rect(L, sigY, W, 28).fill(AMBER_BG).stroke(AMBER);
    doc
      .fillColor(AMBER)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text("Digital Acceptance Record", L + 5, sigY + 5);
    doc
      .fillColor("#92400e")
      .font("Helvetica")
      .fontSize(7.5)
      .text(
        "The Hirer confirmed they had read and understood these Terms, confirmed they are 18+ years of age, accept full responsibility for the equipment, confirmed they have reviewed the manufacturer's safety instructions and user guide (splitithire.com.au/guide), and provided the digital signature below.",
        L + 5,
        sigY + 15,
        { width: W - 10 }
      );

    doc.y = sigY + 32;

    // Two columns: left = signature image, right = details
    const sigColW = W * 0.52;
    const detColX = L + sigColW + 8;
    const detColW = W - sigColW - 8;

    // Signature image
    doc.fillColor(MID).font("Helvetica").fontSize(7).text("Digital Signature:", L, doc.y);
    const sigImgY = doc.y + 10;

    try {
      const base64Data = data.signatureDataUrl.replace(/^data:image\/\w+;base64,/, "");
      const sigBuf = Buffer.from(base64Data, "base64");
      doc.image(sigBuf, L, sigImgY, { width: sigColW - 4, height: 55, fit: [sigColW - 4, 55] });
      doc
        .rect(L, sigImgY, sigColW - 4, 55)
        .strokeColor(BORDER)
        .lineWidth(0.5)
        .stroke();
    } catch {
      doc
        .rect(L, sigImgY, sigColW - 4, 55)
        .strokeColor(BORDER)
        .lineWidth(0.5)
        .stroke();
      doc.fillColor(MID).fontSize(7).text("[Signature on file]", L + 4, sigImgY + 22, { width: sigColW - 10 });
    }

    // Details column
    const detY = doc.y;
    const acceptedFmt = format(data.termsAcceptedAt, "d MMMM yyyy 'at' h:mm a 'AEST'");
    const detailRows: [string, string][] = [
      ["Name", data.customerName],
      ["Email", data.customerEmail],
      ["Booking ID", data.bookingId],
      ["Accepted", acceptedFmt],
    ];

    let rowY = detY;
    for (const [label, value] of detailRows) {
      doc.fillColor(MID).font("Helvetica").fontSize(7).text(label, detColX, rowY, { width: detColW });
      doc
        .fillColor(DARK)
        .font("Helvetica-Bold")
        .fontSize(8)
        .text(value, detColX, rowY + 8, { width: detColW });
      rowY += 20;
    }

    // ── Footer ───────────────────────────────────────────────────────────────
    const footerY = doc.page.height - 28;
    doc
      .moveTo(L, footerY - 6)
      .lineTo(L + W, footerY - 6)
      .strokeColor(BORDER)
      .lineWidth(0.5)
      .stroke();

    doc
      .fillColor(MID)
      .font("Helvetica")
      .fontSize(7)
      .text(
        "Split It Gold Coast  |  ABN: 43 762 412 524  |  Mudgeeraba QLD 4213  |  brett@splitithire.com.au  |  0414 601 836  |  splitithire.com.au",
        L,
        footerY - 2,
        { width: W, align: "center" }
      );

    doc.end();
  });
}
