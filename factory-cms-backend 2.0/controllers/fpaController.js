const FPASheet = require("../models/fpaSheet");
const ExcelJS = require("exceljs");
const nodemailer = require("nodemailer");

/* ---------------- Mail Setup ---------------- */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.zoho.in", // smtp.zoho.com if global account
  port: Number(process.env.SMTP_PORT || 465),
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER || "samcontrol97@zohomail.in", // fallback Zoho email
    pass: process.env.SMTP_PASS || "Samcontrol@97@",           // fallback Zoho password
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || "samcontrol97@zohomail.in";
const PLANT_HEADS = ["yashnoutiyal12@gmail.com", "harpreetsingh10414@gmail.com"];

/* ---------------- Create/Extend Sheet ---------------- */
exports.createOrExtendSheet = async (req, res) => {
  try {
    const { sheetName, machineCode, steps } = req.body;
    let sheet = await FPASheet.findOne({ machineCode });

    if (!sheet) {
      sheet = await FPASheet.create({ sheetName, machineCode, steps });
    } else {
      steps.forEach(step => sheet.steps.push(step));
      await sheet.save();
    }

    res.status(201).json(sheet);
  } catch (err) {
    console.error("createOrExtendSheet error:", err);
    res.status(500).json({ message: "Failed to create/extend sheet" });
  }
};

/* ---------------- Delete Entire Sheet ---------------- */
exports.deleteSheet = async (req, res) => {
  try {
    const { machineCode } = req.params;
    await FPASheet.findOneAndDelete({ machineCode });
    res.json({ success: true, message: "Sheet deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ---------------- Delete Step ---------------- */
exports.deleteStep = async (req, res) => {
  try {
    const { machineCode, stepNumber } = req.params;
    const sheet = await FPASheet.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });

    sheet.steps = sheet.steps.filter(s => s.stepNumber != stepNumber);
    await sheet.save();

    res.json({ success: true, message: "Step deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete step" });
  }
};

/* ---------------- Edit Step ---------------- */
exports.editStep = async (req, res) => {
  try {
    const { machineCode, stepNumber } = req.params;
    const updates = req.body;
    const sheet = await FPASheet.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });

    const step = sheet.steps.find(s => s.stepNumber == stepNumber);
    if (!step) return res.status(404).json({ message: "Step not found" });

    Object.assign(step, updates);
    await sheet.save();

    res.json({ success: true, message: "Step updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to edit step" });
  }
};

/* ---------------- Get Sheet ---------------- */
exports.getSheet = async (req, res) => {
  try {
    const { machineCode } = req.params;
    const sheet = await FPASheet.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });
    res.json(sheet);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sheet" });
  }
};

/* ---------------- Submit Sheet ---------------- */
exports.submitSheet = async (req, res) => {
  try {
    const { submittedBy, values } = req.body;
    const { machineCode } = req.params;   // ✅ take from params

    const sheet = await FPASheet.findOne({ machineCode });
    if (!sheet) return res.status(404).json({ message: "Sheet not found" });

    let hasNG = false;
    const validatedValues = values.map(v => {
      ["FPA01", "FPA02", "Mid01", "LPA01"].forEach(point => {
        if (v[point] && v[point].status === "NG") hasNG = true;
      });
      return v;
    });

    sheet.submissions.push({ submittedBy, values: validatedValues });
    await sheet.save();

    if (hasNG) {
      await transporter.sendMail({
        from: FROM_EMAIL,
        to: PLANT_HEADS.join(","),
        subject: `[FPA][ALERT] NG Found - ${machineCode}`,
        html: `<h2>NG detected in FPA Checksheet</h2>
               <p><b>Machine:</b> ${machineCode}</p>
               <p><b>Submitted By:</b> ${submittedBy}</p>`
      });
    }

    res.json({ success: true, message: "Sheet submitted" });
  } catch (err) {
    console.error("submitSheet error:", err);
    res.status(500).json({ message: "Failed to submit sheet" });
  }
};


/* ---------------- Report API ---------------- */
exports.exportReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = {};

    if (from && to) {
      query["submissions.submittedAt"] = { $gte: new Date(from), $lte: new Date(to) };
    } else if (from) {
      query["submissions.submittedAt"] = { $gte: new Date(from) };
    } else if (to) {
      query["submissions.submittedAt"] = { $lte: new Date(to) };
    }

    const sheets = await FPASheet.find(query);

    const workbook = new ExcelJS.Workbook();
    const sheet1 = workbook.addWorksheet("FPA Report");

    sheet1.addRow([
      "Machine Code", "Sheet Name", "Submitted By", "Submitted At",
      "Step Number", "Drawing Parameter", "Specification",
      "Point", "Value", "Status", "Remarks"
    ]);

    sheets.forEach(s => {
      s.submissions.forEach(sub => {
        sub.values.forEach(v => {
          const step = s.steps.find(st => st.stepNumber == v.stepNumber);
          ["FPA01", "FPA02", "Mid01", "LPA01"].forEach(point => {
            const obj = v[point] || {};
            sheet1.addRow([
              s.machineCode,
              s.sheetName,
              sub.submittedBy,
              sub.submittedAt,
              v.stepNumber,
              step?.drawingParameter || "",
              step?.specification || "",
              point,
              obj.value || "",
              obj.status || "",
              obj.remarks || ""
            ]);
          });
        });
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=fpa_report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("exportReport error:", err);
    res.status(500).json({ message: "Failed to export report" });
  }
};
