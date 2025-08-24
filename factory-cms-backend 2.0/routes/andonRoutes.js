// routes/andonRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/andonController");

// Create ticket
router.post("/tickets", ctrl.createTicket);

// Close ticket (with code)
router.post("/tickets/:id/close", ctrl.closeTicket);

// Get open tickets
router.get("/tickets/open", ctrl.getOpenTickets);

// Get by id
router.get("/tickets/:id", ctrl.getTicketById);

// List/filter tickets
router.get("/tickets", ctrl.listTickets);

// Manual escalate (for testing)
router.post("/cron/escalate", ctrl.manualEscalate);

module.exports = router;
