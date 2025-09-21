const odbc = require("odbc");

const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=${__dirname}/../Datalogs.accdb;`;

async function getDataByDate(req, res) {
  const { table, date } = req.params; // table = "Op20", date = "28-02-2025"

  try {
    const connection = await odbc.connect(connectionString);

    // IMPORTANT: wrap table in [] to avoid reserved word issues
    const sql = `SELECT * FROM [${table}] WHERE Date = ?`;

    const result = await connection.query(sql, [date]);

    await connection.close();
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
}

module.exports = { getDataByDate };
