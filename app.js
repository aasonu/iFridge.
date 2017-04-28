//define modules.
var util = require('util')
  , express = require('express')
  , app = module.exports = express.createServer()
  , io = require('socket.io').listen(app)
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config.json')
  , rc522 = require("rc522-rfid")
  , twilio = require('twilio')
  ,	accountSid = 'AC55952a6b83df916d405922d024588309'
  , authToken = '41369e6a3d578c68287c91814fb6f48e'
  ,	client = new twilio.RestClient(accountSid, authToken)
  , serialport = require('serialport')
  , SerialPort = serialport.SerialPort
  , portName = 'COM3'
  , http = require('http')
  , fs = require('fs')
  , index = fs.readFileSync('index.html')
  , url = require('url')
  , sys  = require('sys')
  , express = require('express')
  , path = require("path")
  , sp = new serialport.SerialPort(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\r\n")
});

app.use(express.static(__dirname + '/public'));

fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(3000);
});

//list serial ports
serialport.list(function (err, ports){
	ports.forEach(function(port){
		console.log(port.comName);
	});
});

io.sockets.on('connection', function (socket) {
    // If socket.io receives message from the client browser then 
    // this call back will be executed.
    socket.on('message', function (msg) {
        console.log(msg);
    });
    // If a web browser disconnects from Socket.IO then this callback is called.
    socket.on('disconnect', function () {
        console.log('disconnected');
    });
});

sp.on('data', function(input) {
    console.log(input);
});


app.configure(function() {
  app.set('env', env);
  app.set('port', process.env.PORT || 3000);
  app.set('phoneNumber', config.twilio.phoneNumber);
  app.set('config', config);
  app.use(express.static(__dirname + "/public"));
});

/* Add a socket.io reference to app */
app.io = io;

client.messages.create({
    body: 'You just placed an item in the fridge.',
    to: '+447535814046',  // Text this number
    from: '++44 1290 211631' // From a valid Twilio number
}, function(err, message) {
    if(err) {
        console.error(err.message);
    }
});









