// ----
// You shouldn't need to modify this file. Work in the 'public' folder instead.
// ----
// Config
const port = 4040;
const showMessages = true; // If true, dumps messages to console
// ---


const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressWs = require('express-ws');
const reload = require('middleware-static-livereload');
const os = require('os');
const ews = expressWs(express());
const app = ews.app;

// Set up the '/ws' resource to handle web socket connections
app.ws('/ws', function (ws, req) {
  // A message has been received from a client
  ws.on('message', function (msg) {
    var clients = ews.getWss('/ws').clients;
    // Debug print it
    if (showMessages)
      console.log(new Date().toLocaleTimeString() + '> ' + msg);

    // Broadcast it to all other clients
    clients.forEach(c => {
      c.send(msg);
    });
  });
});

app.use(reload.middleware({
  documentRoot: '../'
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  if (err.status)
    res.sendStatus(err.status);
  else
    res.sendStatus(500);
});


app.listen(port);
console.log('Server started:\n  http://localhost:' + port + ' (only works on same machine)');

const nets = os.networkInterfaces();
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      console.log('  http://' + net.address + ':' + port + '  (' + name + ')');
    }
  }
}

module.exports = app;