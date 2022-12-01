const express = require("express");
const path = require("path");
const app = express();

app.set("views", "./view");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "view")));

app.get("/", (req, res) => {
  return res.render("index");
});

app.listen(8000, () => {
  console.log("server is running port");
});
