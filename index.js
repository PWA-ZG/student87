const express = require("express");
const path = require("path");
const httpPort = 8080;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(new Date().toLocaleString() + " " + req.url);
    next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(httpPort, function () {
    console.log(`HTTP listening on port: ${httpPort}`);
});

