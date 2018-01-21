var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressWs = require('express-ws');

var ews = expressWs(express());
var app = ews.app;

// Set up the '/ws' resource to handle web socket connections
app.ws('/ws', function(ws, req) {
  // A message has been received from a client
  ws.on('message', function(msg) {
    var clients = ews.getWss('/ws').clients;
    
    // Debug print it
    //console.log(new Date().toLocaleTimeString() + '> ' + msg);

    // Broadcast it to all other clients
    clients.forEach(c=> {
      c.send(msg);
    });
  });
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log("asf");
  if (err.status)
    res.sendStatus(err.status);
  else
    res.sendStatus(500);
});

var port = process.env.PORT ? process.env.PORT : 8080;
app.listen(port);
console.log('Webserver started on ' + port);
module.exports = app;
