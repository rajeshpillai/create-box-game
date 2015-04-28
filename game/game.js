// Initialise Phaser
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');

// Define our 'global' variable
game.global = {
  score: 0
};

// Add all the states
game.state.add('boot', bootState);

// Start the 'boot' state
game.state.start('boot');