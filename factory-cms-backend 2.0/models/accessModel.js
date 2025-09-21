const ADODB = require("node-adodb");
const path = require("path");

// Path to your Access DB file
const dbPath = path.join(__dirname, "../database/Datalogs.accdb");

// Create ADODB connection
const connection = ADODB.open(
  `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${dbPath};Persist Security Info=False;`
);

// Helper query function
async function query(sql, params = []) {
  try {
    const formattedSql = params.reduce(
      (acc, p) => acc.replace("?", `'${p}'`),
      sql
    );
    return await connection.query(formattedSql);
  } catch (err) {
    throw new Error("DB Query Failed: " + err.message);
  }
}

module.exports = query;
