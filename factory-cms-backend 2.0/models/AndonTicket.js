// models/AndonTicket.js
const mongoose = require("mongoose");

const ACTIONS = ["CREATED", "ESCALATED_TO_2", "ESCALATED_TO_3", "CLOSED"];

const historySchema = new mongoose.Schema(
  {
    event: { type: String, enum: ACTIONS, required: true },
    at: { type: Date, default: Date.now },
    by: { type: String, default: "" },   // name or system
    note: { type: String, default: "" },
  },
  { _id: false }
);

const andonTicketSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Quality", "Maintenance", "Store", "Process", "Safety"],
      required: true,
    },
    message: { type: String, required: true },
    operatorName: { type: String, required: true },
    machineCode: { type: String, required: true },

    status: { type: String, enum: ["Open", "Closed"], default: "Open" },

    createdAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
    closedBy: { type: String },

    // escalation
    escalationLevel: { type: Number, default: 1 }, // 1 Immediate, 2 Secondary, 3 Final
    level2At: { type: Date }, // createdAt + 15 min
    level3At: { type: Date }, // createdAt + 45 min
    lastNotifiedLevel: { type: Number, default: 0 }, // 0 none, 1 immediate sent, 2 L2 sent, 3 L3 sent

    // unique code to authorize closing
    closeCode: { type: String, required: true },

    // audit
    history: { type: [historySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AndonTicket", andonTicketSchema);
