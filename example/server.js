// a few useful extensions
Array.prototype.erase = function(item) {
  for (var i = this.length; i--; i) {
    if (this[i] === item) this.splice(i, 1);
  }
  return this;
};

Object.prototype.each = function(iterator, context) {
  for(var key in this) {
    if(this.hasOwnProperty(key)) {
      iterator.call(context, key, this[key]);
    }
  }
  return this;
}



var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    io = require('./Socket.IO-node'),
    fs = require("fs");

/*
Setup a very simple HTTP server to listen on port 3000

It's not smart enough to automatically load index.html, so make sure you go to
http://localhost:3000/index.html in the browser

*/

http.createServer(function(request, response) {
    var uri;
    if (request.url == "/") {
      uri = url.parse('http://localhost:3000/index.html').pathname;
    } else {
      uri = url.parse(request.url).pathname;
    }
    
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists) {
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });
    });
}).listen(3000);

sys.puts("Server running at http://localhost:3000/");

/*
Setup a Socket.IO server that listens to port 8080.
*/

server = http.createServer(function(req, res){});
server.listen(8080);

var io = io.listen(server);


// When a client connects, add them to the clients list, announce them to everyone else, and setup handlers
io.on('connection', function(client){
  client.broadcast({spawn: client.sessionId});
  
  // This is what we do when we receive a message from the client
  client.on('message', function(messageFromClient){
    logger(messageFromClient,client.sessionId);
    client.send(messageFromClient);
    client.broadcast(messageFromClient);
  });
  
  // This is what we do when a client disconnects
  client.on('disconnect', function(){
    client.broadcast({remove: client.sessionId});
  });
});

function logger(message,sessionId) {
  console.log("BROADCAST FROM:", sessionId, message);
}
