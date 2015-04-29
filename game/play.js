// New name for the state
var playState = {
  // Removed the preload function
  create: function() {
    this.cursor = game.input.keyboard.createCursorKeys();
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    
    
    // Add WASK keys support
    this.wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };
    
    game.physics.arcade.enable(this.player);
    
    this.player.body.gravity.y = 500;
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.createMultiple(10, 'enemy');
    this.coin = game.add.sprite(60, 140, 'coin');
    
    game.physics.arcade.enable(this.coin);
    
    this.coin.anchor.setTo(0.5, 0.5);
    this.scoreLabel = game.add.text(30, 30, 'score: 0',
                                    { font: '18px Arial', fill: '#ffffff' 
                                    
                                    });
    
    // New score variable
    game.global.score = 0;
    this.createWorld();
    
    // Add sound
    this.jumpSound = game.add.audio('jump');
    this.coinSound = game.add.audio('coin');
    this.deadSound = game.add.audio('dead');
    
    // Create teh emitter with 15 particles.  We don't need to set the x
    // and y since we don't know where to do the explosion yet
    this.emitter = game.add.emitter(0, 0, 15);
    
    // Set the 'pixel' image for the particles
    this.emitter.makeParticles('pixel');
    
    // Set the y speed of the particles between -150 and 150
    // The speed will be randomly picked between -150 and 150 for each particle
    
    this.emitter.setYSpeed(-150, 150);
    
    // Do the same for the x speed
    this.emitter.setXSpeed(-150, 150);
    
    // Use no gravity for the particles
    this.emitter.gravity = 0;
    
    //game.time.events.loop(2200, this.addEnemy, this);
    // Lets make the game a bit easier
    this.nextEnemy = 0;
    
    // Let phaser handle the up,left,down,right key (to avoid scrolling in browsers)
    
    game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP,
                                      Phaser.Keyboard.DOWN,
                                      Phaser.Keyboard.LEFT,
                                      Phaser.Keyboard.RIGHT);
    
    // If the game is running on a mobile device
    if (!game.device.desktop){
      // Display the mobile inputs
      this.addMobileInputs();
    }
  },
  
  update: function() {
    game.physics.arcade.collide(this.player, this.walls);
    game.physics.arcade.collide(this.enemies, this.walls);
    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin,null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
    
    this.movePlayer();
    
    if (!this.player.inWorld) {
      this.playerDie();
    }
    
    // If the 'nextEnemey' time has passed
    if (this.nextEnemy < game.time.now){
      // Define our variables
      var start = 4000, end = 1000, score = 100;
      
      // Formula to decrease the delay between enemies over time
      // At first it's 4000ms, then slowly goes to 1000ms
      var delay = Math.max(start - (start - end) * game.global.score/score, end);
      
      // We add a new enemy, and update the 'nextEnemy' time
      this.addEnemy();
      
      // And we update 'nextEnemy' to have a new enemy in 2.2 seconds
      this.nextEnemy = game.time.now + delay;
    }
  },
  
  movePlayer: function() {
    // If the left arrow or the A key is pressed
    if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left'); // Start the left animation
    }
    
    // Move the player to the right or the D key is pressed
    else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right'); // Start the right animation
    }
    
    // If nothing is pressed,  Stop the player
    else {
      this.player.body.velocity.x = 0;
      this.player.animations.stop(); // Stop the animation
      this.player.frame = 0;    // Set the player frame to 0 (stand still)
    }
    
    // Make the player jump, if the up arrow or the w key is pressed
    if ((this.cursor.up.isDown || this.wasd.up.isDown) 
      && this.player.body.touching.down) {
        //this.jumpSound.play();
        //this.player.body.velocity.y = -320;
        this.jumpPlayer();
    }
  },
  
  
  // No changes
  takeCoin: function(player, coin) {
    // New score variable
    game.global.score += 5;
    this.scoreLabel.text = 'score: ' + game.global.score;
    
    this.coinSound.play();
    this.updateCoinPosition();
    
    // Scale the coin to 0 to make it invisible
    this.coin.scale.setTo(0,0);
    
    // Grow the coin back to its original scale in 300ms
    game.add.tween(this.coin.scale).to({x:1, y:1}, 300).start();
    
    // Grow the player
    game.add.tween(this.player.scale).to({x:1.3, y:1.3})
              .to({x:1, y:1}, 150)
              .start();
  },
  
  updateCoinPosition: function() {
    var coinPosition = [
      {x: 140, y: 60}, {x: 360, y: 60},
      {x: 60, y: 140}, {x: 440, y: 140},
      {x: 130, y: 300}, {x: 370, y: 300}
    ];
    for (var i = 0; i < coinPosition.length; i++) {
      if (coinPosition[i].x === this.coin.x) {
        coinPosition.splice(i, 1);
      }
    }
    var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length-1)];
    this.coin.reset(newPosition.x, newPosition.y);
  },
  
  addEnemy: function() {
    var enemy = this.enemies.getFirstDead();
    if (!enemy) {
      return;
    }
    enemy.anchor.setTo(0.5, 1);
    enemy.reset(game.world.centerX, 0);
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
    enemy.body.bounce.x = 1;
    enemy.checkWorldBounds = true;
    enemy.outOfBoundsKill = true;
  },
  
  createWorld: function() {
    this.walls = game.add.group();
    this.walls.enableBody = true;
    
    game.add.sprite(0, 0, 'wallV', 0, this.walls);
    game.add.sprite(480, 0, 'wallV', 0, this.walls);
    game.add.sprite(0, 0, 'wallH', 0, this.walls);
    game.add.sprite(300, 0, 'wallH', 0, this.walls);
    game.add.sprite(0, 320, 'wallH', 0, this.walls);
    game.add.sprite(300, 320, 'wallH', 0, this.walls);
    game.add.sprite(-100, 160, 'wallH', 0, this.walls);
    game.add.sprite(400, 160, 'wallH', 0, this.walls);
    
    var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
    middleTop.scale.setTo(1.5, 1);
    
    var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);

    middleBottom.scale.setTo(1.5, 1);
    this.walls.setAll('body.immovable', true);
    
    // Create the 'right' animation bylooping the frame 1 and 2
    this.player.animations.add('right', [1,2], 8, true);
    
    // Create the 'left' animation by looping the frames 3 and 4
    this.player.animations.add('left', [3,4], 8, true);
    
  },
    
  // No changes
  playerDie: function() {
    // If the player is already dead, do nothing
    if (!this.player.alive){
      return;
    }
    
    // Kill the player to make it disapper from the screen
    this.player.kill();
    
    // When the player dies, we go to the menu
    this.deadSound.play();
    
    // Set the position of the emitter on the player
    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y;
    
    // Start the emitter, by exploding 15 particles that will live for 600ms
    
    this.emitter.start(true, 600, null, 15);
    
    game.time.events.add(1000, this.startMenu, this);
  },
  
  startMenu: function (){
    game.state.start('menu');
  },
  
  addMobileInputs: function (){
    // Add the jump button
    this.jumpButton = game.add.sprite(350, 247, 'jumpButton');
    this.jumpButton.inputEnabled = true;
    this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
    this.jumpButton.alpha = 0.5;
    // Movement variables
    this.moveLeft = false;
    this.moveRight = false;
    // Add the move left button
    this.leftButton = game.add.sprite(50, 247, 'leftButton');
    this.leftButton.inputEnabled = true;
    this.leftButton.events.onInputOver.add(function()   {this.moveLeft=true;}, this);
  
    this.leftButton.events.onInputOut
            .add(function(){
              this.moveLeft=false;
            }, this);
    
    this.leftButton.events.onInputDown
            .add(function() {
                this.moveLeft=true;
            }, this);
    
    this.leftButton.events.onInputUp
          .add(function(){
              this.moveLeft=false;
          }, this);
    
    this.leftButton.alpha = 0.5;
    
    // Add the move right button
    this.rightButton = game.add.sprite(130, 247, 'rightButton');
    this.rightButton.inputEnabled = true;
    
    this.rightButton.events.onInputOver.add(function(){this.moveRight=true;},this);
    this.rightButton.events.onInputOut.add(function(){this.moveRight=false;},this);
    this.rightButton.events.onInputDown.add(function(){this.moveRight=true;},this);
    this.rightButton.events.onInputUp.add(function(){this.moveRight=false;},this);
    this.rightButton.alpha = 0.5;
    
  },
  
  jumpPlayer: function(){
    // If the player is touching the ground
    //if (this.player.body.onFloor()){
    if ((this.cursor.up.isDown || this.wasd.up.isDown) 
      && this.player.body.touching.down) {
      // Jump with sound
      this.player.body.velocity.y = -360;
      this.jumpSound.play();
    }
  }
};