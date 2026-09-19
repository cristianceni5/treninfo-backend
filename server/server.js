// =======================
// Cristian Ceni 19/09/26
// Main script per il server backend di Treninfo
// =======================

const express = require("express");
// Inserire il path sennò non trova il file .env
require("dotenv").config({
  path: require("node:path").join(__dirname, "variabili-ambiente", ".env"),
});
const app = express();
const port = process.env.PORTA;

// Serve i file statici dentro public, attenzione al doppio punto
app.use(express.static("../public"));

app.listen(port, () => {
  console.log(`Server backend di Treninfo in esecuzione sulla porta: ${port}`);
});

app.use("/vt", require("./routes/cerca-stazioni"));
