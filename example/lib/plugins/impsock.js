ig.module(
  'plugins.impsock'
)
.requires(
  'impact.impact'
)
.defines(function(){
  ig.Impsock = ig.Class.extend({
    init: function(game) {
      this.host = null;
      this.port = 8080;
      this.game = game;
      this.sessionID = null;
      this.socket = null;
      this.clients = null;
      this.otherClients = null;
      this.disconnectedClients = [];
      
      this.establishSocket();
    },
    
    establishSocket: function() {
      var game = this.game;
      var self = this;
      this.socket = new io.Socket(this.host,{rememberTransport: false, port: this.port, secure: false});
      
      this.socket.on('connect', function(){
        self.sessionID = self.socket.transport.sessionid;
      });
      
      this.socket.on('message', function(messageFromServer){
        self.receive(messageFromServer);
      });
      this.socket.connect();
    },
    
    broadcast: function(e) {
      var properties = e.syncableProperties();
      properties["sessionId"] = e.name;
      var message = {"action": "broadcast", "entity": properties};
      this.socket.send(message);
    },
    
    receive: function(messageFromServer) {
      if (messageFromServer.spawn) {
        this.game.joinHandler(messageFromServer);
        return;
      }
      if (messageFromServer.remove) {
        this.game.disconnectHandler(messageFromServer);
        return;
      }
      this.game.broadcastHandler(messageFromServer);
    }
  });
});