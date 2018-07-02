const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

// create express app
const app = express();

// tell hbs where our partials are providing the absolute path
hbs.registerPartials(__dirname + "/views/partials");

// tell the app to use hbs as its view engine
app.set("view engine", "hbs");

app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  // add the log in a new line to file server.log
  fs.appendFile("server.log", log + "\n", err => {
    if (err) {
      console.log("Unable to append to server.log");
    }
  });
  // call next to continue running the app
  next();
});

app.use((req, res, next) => {
  res.render("maintenance.hbs");
});

// use an express middleware (express.static) providing the absolute path of directory we want to serve
app.use(express.static(__dirname + "/public"));

// create a getCurrentYear helper to use inside of hbs files
hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear();
});

hbs.registerHelper("screamIt", text => {
  return text.toUpperCase();
});

app.get("/", (req, res) => {
  res.render("home.hbs", {
    pageTitle: "Home Page",
    welcomeMessage: "Welcome Express"
  });
});

app.get("/about", (req, res) => {
  res.render("about.hbs", {
    pageTitle: "About Page"
  });
});

app.get("/bad", (req, res) => {
  res.send({ errorMessage: "unabl to handle request" });
});

app.listen(3000, () => {
  console.log("server is up on port 3000");
});
