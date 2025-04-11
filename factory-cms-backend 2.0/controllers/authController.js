const Machine = require("../models/Machine");

// Login
exports.login = async (req, res) => {
  const { deviceID, password } = req.body;
  try {
    const machine = await Machine.findOne({ deviceID });
    if (!machine) return res.status(400).json({ msg: "Invalid device ID" });

    if (password !== machine.password) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    res.json({
      success: true,
      machine: {
        id: machine._id,
        deviceID: machine.deviceID,
        role: machine.role,
        location: machine.location || null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Signup (server only)
exports.signup = async (req, res) => {
  const { deviceID, password, role, location } = req.body;
  try {
    const existing = await Machine.findOne({ deviceID });
    if (existing) return res.status(400).json({ msg: "Device ID already exists" });

    const newMachine = new Machine({ deviceID, password, role, location });
    await newMachine.save();

    res.json({ success: true, msg: "Machine created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Delete Machine
exports.deleteMachine = async (req, res) => {
  const { deviceID } = req.params;
  try {
    await Machine.findOneAndDelete({ deviceID });
    res.json({ success: true, msg: "Machine deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Update Machine
exports.updateMachine = async (req, res) => {
  const { deviceID } = req.params;
  const { newDeviceID, newPassword } = req.body;
  try {
    const updateData = {};
    if (newDeviceID) updateData.deviceID = newDeviceID;
    if (newPassword) updateData.password = newPassword;

    const updated = await Machine.findOneAndUpdate(
      { deviceID },
      { $set: updateData },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Machine not found" });

    res.json({ success: true, msg: "Machine updated", machine: updated });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
