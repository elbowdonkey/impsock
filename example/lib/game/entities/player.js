ig.module(
  'game.entities.player'
)
.requires(
  'impact.entity'
)
.defines(function(){
  EntityPlayer = ig.Entity.extend({
    size: {x: 16, y:16},
    type: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.LITE,
    checkAgainst: ig.Entity.TYPE.B,
    gravityFactor: 0,
    maxVel: {x: 400, y: 400},
    friction: {x: 1000, y:1000},
    speed: 400,
    animSheet: new ig.AnimationSheet( 'media/player.png', 16, 16),
    lastMove: null,
    idleCount: 0,
    movementState: 'idle',
    otherPlayer: false,
    announced: false,
    init: function(x, y, settings) {
      this.parent(x, y, settings);
      
      this.addAnim( 'idle', 1, [0] );
      this.addAnim( 'n', 0.08, [0,1,2,3,4,5]);
      this.addAnim( 's', 0.08, [0,1,2,3,4,5]);
      this.addAnim( 'e', 0.08, [0,1,2,3,4,5]);
      this.addAnim( 'w', 0.08, [0,1,2,3,4,5]);
    },
    update: function() {
      this.parent();
      
      if (!this.name) {
        ig.game.impsock.broadcast(this);
        this.name = ig.game.impsock.sessionID;
      }
      
      if (!this.otherPlayer) {
        this.move("idle");
        if(ig.input.state('e')) this.move("e");
        if(ig.input.state('w')) this.move("w");
        if(ig.input.state('s')) this.move("s");
        if(ig.input.state('n')) this.move("n");
      }
    },
    syncableProperties: function(){
      return {
        pos: this.pos,
        movementState: this.movementState
      }
    },
    move: function(direction){
      this.movementState = direction;
      this.currentAnim = this.anims[direction];
      
      if (direction == "e") this.accel.x = this.speed;
      if (direction == "w") this.accel.x = -this.speed;
      if (direction == "n") this.accel.y = -this.speed;
      if (direction == "s") this.accel.y = this.speed;
      
      if (this.accel.x < 0) this.flip = true;
      if (this.accel.x > 0) this.flip = false;
      
      if (direction == "idle") {
        this.accel.x = this.accel.y = 0;
        this.idleCount += 1;
      } else {
        this.idleCount = 0;
      }
      
      // when we've moved, broadcast our position to everyone else
      if (this.idleCount <= 1 && this.otherPlayer == false) {
        ig.game.impsock.broadcast(this);
      }
      this.currentAnim.flip.x = this.flip;
    }
  });
});
