const net = require("net");

const PLC_IP = "192.168.0.10";
const PLC_PORT = 5002;

const client = new net.Socket();

client.connect(PLC_PORT, PLC_IP, () => {
  console.log(`✅ Connected to PLC at ${PLC_IP}:${PLC_PORT}`);

  // Read D0 to D9 (10 words)
  const readD0toD9 = Buffer.from([
  0x50,0x00,0x00,0x00,0xFF,0xFF,0x03,0x00,0x00,0x00, // Subheader + Net + PC + IO + Station
  0x0C,0x00, // Data length (12 bytes follow)
  0x10,0x00, // Monitoring timer
  0x01,0x04, // Command (batch read)
  0x00,0x00, // Subcommand
  0xA8,0x00,0x00,0x00, // Head device (D0)
  0x0A,0x00  // Number of points (10 words)
]);


  console.log("📤 Sending batch read request (D0–D9)...");
  client.write(readD0toD9);
});

client.on("data", (data) => {
  console.log("📩 Raw PLC Response:", data.toString("hex"));

  // Skip header and extract word values
  if (data.length > 11) {
    const values = [];
    for (let i = 11; i < data.length; i += 2) {
      const word = data.readUInt16LE(i);
      values.push(word);
    }
    console.log("📊 D0–D9 values:", values);
  }
});

client.on("error", (err) => {
  console.error("❌ PLC Error:", err.message);
});

client.on("close", () => {
  console.log("🔌 Disconnected from PLC");
});
