var chalk = require('chalk');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var expressWs = require('express-ws');
var errorHandler = require('errorhandler');

var index = require('./routes/index');
var users = require('./routes/users');

var program = require('commander');
const log = console.log;
let port = null;

log(chalk.bold('json-serial-bridge'));
program
  .version('0.0.1')
  .option('-s, --serial [port]', 'Specify serial port', 'com5')
  .option('-p, --port [port]', 'Specify web server port', 4000)
  .option('-b, --baud [rate]', 'Baud rate', 9600)
  .option('-d, --debug', 'verbose mode');

program
  .command('list')
  .description('list available serial ports')
  .action(function(env, opts) {
    listPorts();
  });

program
  .command('bridge')
  .description('bridge serial port to websockets')
  .action(function(env, opts) {
    bridgePorts(program);
  });

program.parse(process.argv);
if (program.args.length == 0) program.help();
return;

function listPorts() {
  SerialPort.list(function(err, ports) {
    if (err) {
      log('Error, could not list ports: ' + err);
      return;
    }
    log('Ports:');
    let aPort = 'COM1';
    ports.forEach(function(port) {
      aPort = port.comName;
      log(' ' + chalk.bold(port.comName) + ' - ' + port.manufacturer);
    });
    log();
    log('Usage example: node app.js --serial ' + aPort + ' bridge');
    process.exit();
  });
}

function bridgePorts(program) {
  var ews = expressWs(express());
  var app = ews.app;

  app.ws('/serial', function(ws, req) {
    ws.on('message', function(msg) {
      // Received a message via websocket (ie, from the browser)
      // send it to the serial port
      if (program.debug) {
        console.log('Ws received: ' + msg);
      }
      port.write(msg + '\r\n');
      port.drain();
    });
  });
  var serialWs = ews.getWss('/serial');
  app.use(
    require('middleware-static-livereload')({
      documentRoot: 'public/'
    })
  );
  app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function(req, res, next) {
    return res.status(404).send('Not found');
  });
  app.use(errorHandler());
  app.use(function(err, req, res, next) {
    return res.status(500).send({ error: err });
  });

  log('Opening webserver on port ' + program.port + '...');
  app
    .listen(program.port)
    .on('error', function(e) {
      log(
        chalk.red(
          'Could not start webserver on port ' +
            program.port +
            "' - is it already running?"
        )
      );
    })
    .on('listening', function() {
      log('✅ Opened. Available at http://localhost:' + program.port);
      setupSerial(program, serialWs);
    });
}

function setupSerial(program, serialWs) {
  // Init port
  log(
    'Opening serial port ' +
      program.serial +
      ' with baud rate ' +
      program.baud +
      '...'
  );
  port = new SerialPort(
    program.serial,
    { baudRate: program.baud },
    function(err) {
      if (err) {
        log(chalk.red(err.message));
        process.exit();
      } else {
        log('✅ Opened. Use CTRL+C to stop.');
        if (!program.debug)
          log('Start with --debug to monitor traffic in the terminal');
      }
    }
  );

  // Listen for events
  port.on('close', function(err) {
    console.log('Port closed ' + err);
  });
  port.on('error', function(err) {
    console.log('Port error: ' + err);
  });

  // Parse data as a series of newline-separated chunks
  const parser = port.pipe(new Readline());

  // Got a chunk
  parser.on('data', function(data) {
    if (program.debug) console.log('Serial Received: ' + data);

    // Send the text we received on the serial port to all clients
    if (serialWs) {
      serialWs.clients.forEach(function(client) {
        try {
          client.send(data);
        } catch (e) {}
      });
    }
  });
}
