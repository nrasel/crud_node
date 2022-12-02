const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConnect");
const cookiParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

// const authRouter=require('./Routes/authRoute');

app.set("views", "./view");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "view")));

// app.use('/',authRouter)
// fs.readFile()

app.use(bodyParser.urlencoded({ extends: true }));
app.use(cookiParser());
app.use(
  session({
    secret: "woot",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

fs.readdirSync(`${__dirname}/Routes`).map((filename) => {
  app.use(
    "/",
    require(path
      .join(`${__dirname}`, "/Routes", `${filename}`)
      .replace(".js", ""))
  );
});

app.get("/", (req, res) => {
  // return res.render("index");
  res.send("home");
});

dbConnect();

app.listen(8000, () => {
  console.log("server is running port");
});
