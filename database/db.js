var mongoose = require('mongoose');
var config = require('../config.js');

var options = { keepAlive: true, useFindAndModify: false};
const mongoConnection = mongoose.connect(config.dbURI, options);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
// Connected handler
mongoose.connection.on('connected', function (err) {
  console.log("Connected to DB using chain: " + config.dbURI);
});

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {

});

const getDB = () => db
const connectDB = () => mongoConnection
const disconnectDB = () => db.close()

module.exports = { connectDB, getDB, disconnectDB }
