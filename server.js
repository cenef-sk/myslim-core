const express = require('express');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const config = require('./config');
const authentifier = require('./authentifier');
const User = require('./database/schemas/User');
// const Game = require('./database/schemas/Game');
// //TODO changes to https
// const https = require('http')

const app = express();
const API_PATH = '/api/'

const PLUGGY = {
  protocol: 'http:',
  hostname: 'localhost',
  port: 3000,
  // protocol: 'https:',
  // hostname: 'beta.pluggy.eu',
  // port: 443,
  // path: '/api/v1/'
}
// const PLUGGY_API = PLUGGY.protocol + "//" + PLUGGY.hostname + PLUGGY.path;


// if (process.argv.length != 5){
//   console.log(process.argv)
//   console.log("There are expected arguments to run myslim-core:");
//   console.log("google-email");
//   console.log("google-password");
//   console.log("secret");
//   process.exit(0);
// }


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Start mongodb connection
const dbconnection = require('./database/db.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
//TODO add logger
app.use(authentifier)

const users = require('./routes/users')
app.use(API_PATH + 'users/', users);

const themes = require('./routes/themes')
app.use(API_PATH + 'themes/', themes);

const topics = require('./routes/topics')
app.use(API_PATH + 'topics/', topics);

const trials = require('./routes/trials')
app.use(API_PATH + 'trials/', trials);

const participants = require('./routes/participants')
app.use(API_PATH + 'participants/', participants);

const documents = require('./routes/documents')
app.use(API_PATH + 'documents/', documents);

//TODO add error logger


app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
