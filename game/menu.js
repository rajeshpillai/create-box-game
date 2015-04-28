var menuState = {
  create: function() {
    // Add a background image
    game.add.image(0, 0, 'background');
    
    // Change the y position to -50, so we don't see the label
    var nameLabel = game.add.text(game.world.centerX, -50, 'Super Coin Box',
                  { font: '50px Arial', fill: '#ffffff' });
    
    nameLabel.anchor.setTo(0.5, 0.5);
    
    // Create a tween on the label
    var tween = game.add.tween(nameLabel);
    
    // Change the y position of the label to 80, in 1000 ms
    tween.to({y:80}, 1000);
    
    // Start the tween
    tween.start();
    
    // Show the score at the center of the screen
    var scoreLabel = game.add.text(game.world.centerX,
                        game.world.centerY,'score: ' + game.global.score,
                        { font: '25px Arial', fill: '#ffffff' });
    scoreLabel.anchor.setTo(0.5, 0.5);
    
    // Explain how to start the game
    
    var startLabel = game.add.text(game.world.centerX, 
                           game.world.height-80, 
                           'press the up arrow key to start',
                           { font: '25px Arial', fill: '#ffffff' });

    startLabel.anchor.setTo(0.5, 0.5);

    // Create a new Phaser keyboard variable: the up arrow key
    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    // When the 'upKey' is pressed, it will call the 'start' function once
    upKey.onDown.addOnce(this.start, this);
  },
  
  start: function() {
    // Start the actual game
    game.state.start('play');
  },
};