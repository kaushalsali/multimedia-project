// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

const Timecode = require('smpte-timecode');
var serverStartTime = Timecode(new Date());

var server = http.createServer(handleRequest);
var port = 3000;

server.listen(port);
console.log('Listening on port ' + port);

function handleRequest(req, res) {
  var pathname = req.url;

  if (pathname == '/') {
    pathname = '/src/view/index.html';
  }

  var ext = path.extname(pathname);

  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  var contentType = typeExt[ext] || 'text/plain';

  fs.readFile(__dirname + pathname,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}

var io = require('socket.io').listen(server);

let serverNodeManager = {};

io.sockets.on('connection', function (socket) {
  console.log("Client connected: " + socket.id + " " + Timecode(new Date()).subtract(serverStartTime).toString());

  socket.on('connected', (data) => {
    for (let node of Object.keys(serverNodeManager)) {
      socket.emit('add-remote-node', {node: node, name: serverNodeManager[node].name, x: serverNodeManager[node].x, y: serverNodeManager[node].y, config: serverNodeManager[node].config});
      for (let sample of serverNodeManager[node].samples) {
        socket.emit('add-sample-to-remote-node', {node: node, note: sample});
      }
    }
  });

  socket.on('add-user-node', (data) => {
    if (!(data.node in serverNodeManager)) {
      serverNodeManager[data.node] = {name: data.name, x: data.x, y: data.y, config: data.config, samples: []};
      console.log(serverNodeManager);
      socket.broadcast.emit('add-remote-node', data);
    }
  });

  socket.on('add-sample-to-user-node', (data) => {
    if (data.node in serverNodeManager) {
      if (serverNodeManager[data.node].samples != undefined) {
        serverNodeManager[data.node].samples.push(data.note);
        console.log(serverNodeManager);
        socket.broadcast.emit('add-sample-to-remote-node', data);
      }
    }
  });

  socket.on('change-user-synth', (data) => {
    if(data.node in serverNodeManager) {
      serverNodeManager[data.node].config = data.config;
      console.log(serverNodeManager);
      socket.broadcast.emit('change-remote-synth', data);
    }
  });
   
  socket.on('clear-user-node', (data) => {
    if (data.node in serverNodeManager) {
      serverNodeManager[data.node].samples = [];
      console.log(serverNodeManager);
      socket.broadcast.emit('clear-remote-node', data);
    }
  });

  socket.on('delete-user-node', (data) => {
    if (data.node in serverNodeManager) {
      delete serverNodeManager[data.node];
      console.log(serverNodeManager);
      socket.broadcast.emit('delete-remote-node', data);
    }
  });

  socket.on('disconnect', function() {
     console.log("Client " + socket.id + " has disconnected");
     for (let node of Object.keys(serverNodeManager)) {
      if (node.includes(socket.id.toString())) {
        socket.broadcast.emit('delete-remote-node', {node: node});
        delete serverNodeManager[node];
        console.log(serverNodeManager);
      }
     }
  });
  }
);