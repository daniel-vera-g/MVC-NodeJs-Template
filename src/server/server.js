const express = require('express');

const app = express();
const path = require('path');
const morgan = require('morgan');
// morgan logging utility
app.use(morgan('combined'));
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: '../../config/.env' });
const debug = require('debug')('APP:server');
const reload = require('reload');
const exphbs = require('express-handlebars');

debug('Setting up Config');

// server static files
app.use(express.static(path.join(__dirname, '../client/public/')));

// view engine
const viewsPath = path.join(__dirname, '../client/', 'views');
app.set('views', viewsPath);
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'layout',
    layoutsDir: `${viewsPath}/layouts`,
  }),
);
app.set('view engine', 'handlebars');


// body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

// TODO mongoose custom configuration
// mongoose.connect(process.env.DB_CONN).then(() => {
//     debug("Connection to DB was successful");
// }).catch( err => {
//     debug('App starting error:' + err);
// })

// router
const router = require('./routes/routes.js');

app.use('/', router);

reload(app);

module.exports = app;
