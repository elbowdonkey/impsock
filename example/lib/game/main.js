ig.module( 
  'game.main' 
)
.requires(
  'impact.game',
  'plugins.impsock',
  'game.entities.player'
)
.defines(function(){
  Sample = ig.Game.extend({
    startingPosX: ((Math.random() * 200).toInt() + 16),
    startingPosY: ((Math.random() * 50).toInt() + 16),
    firstUpdate: true,
    playerCount: 0,
    init: function() {
      // setup our very simple level
      this.loadLevel(this.defaultLevel());
      this.collision = this.collisionMap;
      this.walls = this.backgroundMaps[1];
      
      // setup WASD keys
      this.setupInput();
      
      // setup impsock
      this.impsock = new ig.Impsock(this);
    },
    update: function() {
      this.parent();
      
      if (this.impsock.socket.connected) {
        this.joinGame();
      } else {
        // wait until connected
        
      }
      
    },
    joinGame: function() {
      if (this.getEntitiesByType(EntityPlayer).length == 0) {
        // spawn our player entity
        this.spawnEntity(EntityPlayer, this.startingPosX, this.startingPosY);

        // when first loading the client, there's only one EntityPlayer
        this.player = this.getEntitiesByType(EntityPlayer)[0];
        
        // announce our arrival to other clients
        this.impsock.broadcast(this.player);
      }
    },
    
    /*
      Setup some methods to handle messages/events from other clients
    */
    joinHandler: function(message) {
      // create a new entity for the player that just joined
      this.spawnOtherPlayer(message.spawn);
    },
    disconnectHandler: function(message) {
      var orphan = ig.game.getEntityByName(message.remove);
      if (orphan) {
        orphan.kill();
      }
    },
    broadcastHandler: function(message) {
      if (message.entity) {
        this.spawnOtherPlayer(message.entity);
        this.updateOtherPlayer(message.entity);
      }
    },
    spawnOtherPlayer: function(playerDetails) {
      if (playerDetails.sessionId == undefined) {return;}
      if (this.player && playerDetails.sessionId == this.player.name) {return;}
      
      var otherPlayer = this.getEntityByName(playerDetails.sessionId);
      
      if (!otherPlayer) {
        otherPlayer = this.spawnEntity(
            EntityPlayer,
            playerDetails.pos.x,
            playerDetails.pos.y, 
            {
              name: playerDetails.sessionId,
              otherPlayer: true,
              animSheet: new ig.AnimationSheet( 'media/ghost.png', 16, 16)
            }
        );
      }
    },
    updateOtherPlayer: function(playerDetails) {
      if (playerDetails.sessionId == undefined) {return;}
      if (this.player && playerDetails.sessionId == this.player.name) {return;}
      
      var otherPlayer = this.getEntityByName(playerDetails.sessionId);
      if (otherPlayer) {
        otherPlayer.move(playerDetails.movementState);
      }
    },
    /*
      Setup a simple level to start playing around in.
    */
    defaultLevel: function() {
      return {
        entities: [],
        layer: [
            {
            name: "collision",
            tilesetName: "media/walls.png",
            repeat: false,
            distance: 1,
            tilesize: 16,
            data: this.defaultMap({makeSolid: true}),
          },
          {
            name: "walls",
            tilesetName: "media/walls.png",
            repeat: false,
            distance: 1,
            tilesize: 16,
            data: this.defaultMap(),
          }
        ]
      }
    },
    defaultMap: function() {
      return [
        [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
        [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      ]
    },
    setupInput: function() {
      ig.input.bind( ig.KEY.A, 'w' );
      ig.input.bind( ig.KEY.D, 'e' );
      ig.input.bind( ig.KEY.W, 'n' );
      ig.input.bind( ig.KEY.S, 's' );
    }
  });
  ig.main('#canvas',Sample, 60, 256, 128, 2);
});
