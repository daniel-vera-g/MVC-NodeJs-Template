const express = require("express");
const path = require("path");
const morgan = require("morgan");
const createError = require("http-errors");
const bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ path: "../../config/.env" });
const debug = require("debug")("APP:server");
const reload = require("reload");
const exphbs = require("express-handlebars");
const winston = require("../../config/winston");

const indexRouter = require("./routes/routes.js");

debug("Setting up Config");

const app = express();


// view engine
const viewsPath = path.join(__dirname, "../client/", "views");
app.set("views", viewsPath);
app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "layout",
		layoutsDir: `${viewsPath}/layouts`,
	}),
);
app.set("view engine", "handlebars");

// morgan logging utility
app.use(morgan("tiny", { stream: winston.stream }));
app.use(express.json());

// server static files
app.use(express.static(path.join(__dirname, "/../client/public")));
app.use(cookieParser());
// body parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

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

reload(app);

module.exports = app;
// TODO mongoose custom configuration
// mongoose.connect(process.env.DB_CONN).then(() => {
//     debug("Connection to DB was successful");
// }).catch( err => {
//     debug('App starting error:' + err);
// })
