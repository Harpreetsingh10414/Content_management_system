// controllers/andonController.js
const AndonTicket = require("../models/AndonTicket");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

/* -------------------------------------------
   CONFIG
------------------------------------------- */

// Map category -> escalation email lists
// ⛳️ UPDATE THESE TO YOUR TEAM EMAILS
const CATEGORY_EMAILS = {
  Quality: {
    lvl1: [
      "ravikant.yadav@skh-sila.com",
      "yogesh@skh-sila.com"
    ],
    lvl2: ["Ashish.pal@skh-sila.com",
      "priti.saran@skh-sila.com"],
    lvl3: ["bhupendra.kumar@skh-sila.com"],
  },
  Maintenance: {
    lvl1: ["mahanth.ram@skh-sila.com",
      "brijesh.yadav1@skh-sila.com"
    ],
    lvl2: ["Ashish.pal@skh-sila.com",
      "priti.saran@skh-sila.com"
    ],
    lvl3: ["bhupendra.kumar@skh-sila.com"],
  },
  Store: {
    lvl1: ["store.sila@skh-sila.com",
      "rakesh.bhat@skh-sila.com"
    ],
    lvl2: ["priti.saran@skh-sila.com",
      "bhooshan.chaturvedi@skh-sila.com"
    ],
    lvl3: ["bhupendra.kumar@skh-sila.com"],
  },
  Process: {
    lvl1: ["ravikant.yadav@skh-sila.com",
      "yogesh@skh-sila.com",
      "brijesh.yadav1@skh-sila.com"
    ],
    lvl2: ["Ashish.pal@skh-sila.com",
      "priti.saran@skh-sila.com"
    ],
    lvl3: ["bhupendra.kumar@skh-sila.com"],
  },
  Safety: {
    lvl1: ["dimpal.kumar@skh-sila.com"],
    lvl2: ["ellora.das@skh-sila.com"],
    lvl3: ["Ashish.pal@skh-sila.com",
      "priti.saran@skh-sila.com",
      "bhupendra.kumar@skh-sila.com"
    ],
  },
};

/* -------------------------------------------
   SMTP CONFIG (Zoho)
------------------------------------------- */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.zoho.in", // for Indian accounts; use smtp.zoho.com if global
  port: Number(process.env.SMTP_PORT || 465),
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER || "samcontrol97@zohomail.in", // your Zoho email
    pass: process.env.SMTP_PASS || "Samcontrol@97@",        // use app password if 2FA enabled
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || "samcontrol97@zohomail.in";

/* -------------------------------------------
   HELPERS
------------------------------------------- */

function genCloseCode(category) {
  const prefix = category.slice(0, 3).toUpperCase();
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}`;
}

function minutesFrom(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}

async function sendMail({ to, subject, html }) {
  if (!to || to.length === 0) return;
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: to.join(","),
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to.join(",")}`);
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }
}

function buildEmailHTML({ ticket, level }) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;">
      <h2>ANDON ${level ? "Escalation Level " + level : "Ticket Created"}</h2>
      <p><b>Category:</b> ${ticket.category}</p>
      <p><b>Machine:</b> ${ticket.machineCode}</p>
      <p><b>Message:</b> ${ticket.message}</p>
      <p><b>Operator:</b> ${ticket.operatorName}</p>
      <p><b>Created At:</b> ${new Date(ticket.createdAt).toLocaleString()}</p>
      <hr/>
      <p><b>Close Code:</b> ${ticket.closeCode}</p>
      <p>Use this code to close the ticket:</p>
      <code>POST /api/andon/tickets/${ticket._id}/close { "closeCode": "${ticket.closeCode}", "closedBy": "Your Name" }</code>
    </div>
  `;
}

/* -------------------------------------------
   CONTROLLERS
------------------------------------------- */

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const { category, message, operatorName, machineCode } = req.body;

    if (!category || !message || !operatorName || !machineCode) {
      return res.status(400).json({ message: "category, message, operatorName, machineCode are required" });
    }

    if (!CATEGORY_EMAILS[category]) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const createdAt = new Date();
    const closeCode = genCloseCode(category);

    const ticket = await AndonTicket.create({
      category,
      message,
      operatorName,
      machineCode,
      closeCode,
      createdAt,
      escalationLevel: 1,
      level2At: minutesFrom(createdAt, 15),
      level3At: minutesFrom(createdAt, 45),
      lastNotifiedLevel: 0,
      history: [{ event: "CREATED", by: operatorName, note: "Ticket opened" }],
    });

    // Notify Level 1
    await sendMail({
      to: CATEGORY_EMAILS[category].lvl1,
      subject: `[ANDON][Level 1] ${category} - ${machineCode} - ${message}`,
      html: buildEmailHTML({ ticket, level: 1 }),
    });

    ticket.lastNotifiedLevel = 1;
    await ticket.save();

    return res.status(201).json({
      success: true,
      ticketId: ticket._id,
      closeCode: ticket.closeCode,
      escalationLevel: ticket.escalationLevel,
    });
  } catch (err) {
    console.error("createTicket error:", err);
    return res.status(500).json({ message: "Failed to create ticket", error: err.message });
  }
};

// Close Ticket
exports.closeTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { closeCode, closedBy } = req.body;

    const ticket = await AndonTicket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.status === "Closed") return res.status(409).json({ message: "Ticket already closed" });

    if (!closeCode || closeCode !== ticket.closeCode) {
      return res.status(403).json({ message: "Invalid close code" });
    }

    ticket.status = "Closed";
    ticket.closedAt = new Date();
    ticket.closedBy = closedBy || "Unknown";
    ticket.history.push({ event: "CLOSED", by: closedBy || "Unknown", note: "Ticket closed with code" });

    await ticket.save();

    // Notify all levels
    const allRecipients = [
      ...(CATEGORY_EMAILS[ticket.category].lvl1 || []),
      ...(CATEGORY_EMAILS[ticket.category].lvl2 || []),
      ...(CATEGORY_EMAILS[ticket.category].lvl3 || []),
    ];
    await sendMail({
      to: allRecipients,
      subject: `[ANDON][Closed] ${ticket.category} - ${ticket.machineCode}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;">
          <h2>ANDON Ticket Closed</h2>
          <p><b>Category:</b> ${ticket.category}</p>
          <p><b>Machine:</b> ${ticket.machineCode}</p>
          <p><b>Message:</b> ${ticket.message}</p>
          <p><b>Closed By:</b> ${ticket.closedBy}</p>
          <p><b>Closed At:</b> ${new Date(ticket.closedAt).toLocaleString()}</p>
        </div>
      `,
    });

    return res.json({ success: true, message: "Ticket closed successfully" });
  } catch (err) {
    console.error("closeTicket error:", err);
    return res.status(500).json({ message: "Failed to close ticket", error: err.message });
  }
};

// List Open Tickets
exports.getOpenTickets = async (_req, res) => {
  try {
    const tickets = await AndonTicket.find({ status: "Open" }).sort({ createdAt: -1 });
    return res.json(tickets);
  } catch (err) {
    console.error("getOpenTickets error:", err);
    return res.status(500).json({ message: "Failed to fetch open tickets" });
  }
};

// Get Ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const t = await AndonTicket.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Ticket not found" });
    return res.json(t);
  } catch (err) {
    console.error("getTicketById error:", err);
    return res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

// List Tickets with Filters
exports.listTickets = async (req, res) => {
  try {
    const { category, machineCode, status, from, to } = req.query;
    const q = {};
    if (category) q.category = category;
    if (machineCode) q.machineCode = machineCode;
    if (status) q.status = status;

    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }

    const tickets = await AndonTicket.find(q).sort({ createdAt: -1 });
    return res.json(tickets);
  } catch (err) {
    console.error("listTickets error:", err);
    return res.status(500).json({ message: "Failed to list tickets" });
  }
};

/* -------------------------------------------
   ESCALATION SCHEDULER
------------------------------------------- */

async function escalateIfNeeded(ticket) {
  const now = new Date();
  let changed = false;

  if (ticket.status === "Closed") return false;

  if (now >= ticket.level2At && ticket.escalationLevel === 1) {
    ticket.escalationLevel = 2;
    ticket.history.push({ event: "ESCALATED_TO_2", by: "system", note: "Auto escalation after 15 min" });

    await sendMail({
      to: CATEGORY_EMAILS[ticket.category].lvl2,
      subject: `[ANDON][Level 2] ${ticket.category} - ${ticket.machineCode} - ${ticket.message}`,
      html: buildEmailHTML({ ticket, level: 2 }),
    });

    ticket.lastNotifiedLevel = 2;
    changed = true;
  }

  if (now >= ticket.level3At && ticket.escalationLevel <= 2) {
    ticket.escalationLevel = 3;
    ticket.history.push({ event: "ESCALATED_TO_3", by: "system", note: "Auto escalation after +30 min" });

    await sendMail({
      to: CATEGORY_EMAILS[ticket.category].lvl3,
      subject: `[ANDON][Level 3 - FINAL] ${ticket.category} - ${ticket.machineCode} - ${ticket.message}`,
      html: buildEmailHTML({ ticket, level: 3 }),
    });

    ticket.lastNotifiedLevel = 3;
    changed = true;
  }

  if (changed) {
    await ticket.save();
  }
  return changed;
}

// Runs every minute
exports.startEscalationScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const openTickets = await AndonTicket.find({ status: "Open" });
      for (const t of openTickets) {
        await escalateIfNeeded(t);
      }
    } catch (err) {
      console.error("Escalation scheduler error:", err);
    }
  });
  console.log("⏰ Andon escalation scheduler started (every 1 min).");
};

// Manual trigger (for testing)
exports.manualEscalate = async (_req, res) => {
  try {
    const openTickets = await AndonTicket.find({ status: "Open" });
    let changed = 0;
    for (const t of openTickets) {
      const ch = await escalateIfNeeded(t);
      if (ch) changed++;
    }
    return res.json({ success: true, escalated: changed });
  } catch (err) {
    console.error("manualEscalate error:", err);
    return res.status(500).json({ message: "Manual escalation failed" });
  }
};
