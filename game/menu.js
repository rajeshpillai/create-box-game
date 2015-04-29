var menuState = {
  create: function() {
    // Add a background image
    game.add.image(0, 0, 'background');
    
    // Change the y position to -50, so we don't see the label
    var nameLabel = game.add.text(game.world.centerX, -50, 
                    'Super Coin Box',
                  { font: '70px Geo', fill: '#ffffff' });
    
    nameLabel.anchor.setTo(0.5, 0.5);
    
    
    // Add tweening using chaining
    game.add.tween(nameLabel)
        .to({y:80}, 1000).easing(Phaser.Easing.Bounce.Out)
        .start();
    
   
    
    // Explain how to start the game
    
    if (game.device.desktop) {
      var text = 'press the up arrow key to start';
    }
    else{
      var text = 'touch the screen to start';
    }
    
    var startLabel = game.add.text(game.world.centerX, 
                           game.world.height-80, 
                           text,
                           { font: '25px Arial', fill: '#ffffff' });

    startLabel.anchor.setTo(0.5, 0.5);

    // Add rotate tween to startLabel
    game.add.tween(startLabel).to({angle: -2}, 500)
            .to({angle:2}, 500)
            .loop()
            .start();
    
    // Create a new Phaser keyboard variable: the up arrow key
    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    // When the 'upKey' is pressed, it will call the 'start' function once
    upKey.onDown.addOnce(this.start, this);
    
    // Add touch event
    game.input.onDown.addOnce(this.start, this);
    
    // If 'bestScore' is not defined
    // It means that this is the first time the game is played
    if (!localStorage.getItem('bestScore')){
      localStorage.setItem('bestScore', 0);
    }
    
    // If the score is higher that the best score
    if (game.global.score > localStorage.getItem('bestScore')){
      // Then udpate the best score
      localStorage.setItem('bestScore', game.global.score);
    }
   
    
    var text = 'Score: ' + game.global.score + '\nbest score: ' +
            localStorage.getItem('bestScore');
    
     // Show the score at the center of the screen
    var scoreLabel = game.add.text(game.world.centerX,
                        game.world.centerY,'score: ' + text,
                        { font: '25px Arial', fill: '#ffffff' });
    scoreLabel.anchor.setTo(0.5, 0.5);
    
    // Add the mute button that calls the 'toggleSound' function 
    this.muteButton = game.add.button(20,20,'mute', this.toggleSound, this);
    
    // If the mouse is over the button, it becomes hand cursor
    this.muteButton.input.useHandCursor = true;
    
    // If the game is already muted
    if (game.sound.mute){
      // Change the frame to display the speaker with no sound
      this.muteButton.frame = 1;
    }
  },
  
  start: function() {
    // Start the actual game
    game.state.start('play');
  },
  
  // Function called when the 'muteButton' is pressed
  toggleSound: function (){
    // Switch the Phaser sound variable from true to false, or false
    // to true when 'game.sound.mute = true', Phaser will mute the game
    game.sound.mute = ! game.sound.mute;
    
    // Change the frame of the button
    this.muteButton.frame = game.sound.mute ? 1: 0;
  }
};