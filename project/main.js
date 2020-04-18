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

io.sockets.on('connection', function (socket) {
  console.log("Client connected: " + socket.id + " " + Timecode(new Date()).subtract(serverStartTime).toString());

  socket.on('add-user-node', (data) => {
    socket.broadcast.emit('add-remote-node', data);
  });

  socket.on('add-sample-to-user-node', (data) => {
    socket.broadcast.emit('add-sample-to-remote-node', data);
  });
   
  socket.on('clear-user-node', (data) => {
    socket.broadcast.emit('clear-remote-node', data);
  });

  socket.on('disconnect', function() {
     console.log("Client " + socket.id + " has disconnected");
     socket.broadcast.emit('delete-remote-node', {user: socket.id});
  });
  }
);