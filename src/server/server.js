const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config({path: "../../config/.env"});
const debug = require("debug")("server");
const exphbs = require("express-handlebars");
const winston = require("../../config/winston");

const indexRouter = require("./routes/routes.js");

debug("Setting up Config");

// morgan logging utility
app.use(morgan("tiny", {stream: winston.stream}));

// view engine
const viewsPath = path.join(__dirname, "../client/", "views");
app.set("views", viewsPath);
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "layout",
    layoutsDir: `${viewsPath}/layouts`,
  })
);
app.set("view engine", "handlebars");

// server static files & express
app.use(express.static(path.join(__dirname, "/../client/public")));
app.use(cookieParser());
app.use(express.json());

// body parser
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: false}));

// TODO mongoose custom configuration
// mongoose.connect(process.env.DB_CONN).then(() => {
//     debug("Connection to DB was successful");
// }).catch( err => {
//     debug('App starting error:' + err);
// })

// router
app.use("/", indexRouter);

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
