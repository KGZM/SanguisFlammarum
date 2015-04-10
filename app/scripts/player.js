var SF;
(function(SF) {
  "use strict";

  var Player = SF.Player = function() {
    this.tracks = [];
    this.currentTrack = null;
    //Set up audio.

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audio  = { 
      context: audioCtx,
      analyser: audioCtx.createAnalyser(),
      gain: audioCtx.createGain(),
      destination: audioCtx.destination
    }
    this.audio.gain.connect(this.audio.destination)
  }

  Player.prototype.selectTrack = function(index) {
    var track = this.tracks[index];
    this.currentTrack = track;

    //Wire up the audio stuff.
    this.audio.source = new Audio(track.path + "/" + track.settings.audio);
    this.audio.sourceNode = this.audio.context.createMediaElementSource(this.audio.source);
    this.audio.sourceNode.connect(this.audio.analyser);
    this.audio.sourceNode.connect(this.audio.gain);
  }

  Player.prototype.addTrack = function(path, settings) {
    var track = new Track(path, settings);
    this.tracks.push(track);
  }
  Player.prototype.playTrack = function(index) {
    var track = this.tracks[index];
    this.currentTrack = track;
    this.status = "playing";
    track.setup();
    track.play();
  }

  var Track = SF.Track = function(path, settings) {
    this.path = path;
    this.settings = settings;
    this.context = {
      uniforms: {}
    };
  }

  Track.prototype.setup = function(player) {
    //Initialize the graphics context.
    //Hm. I'm going to need to retrieve the actual shader source.
    //player.graphics.setupProgram(


    //Run user supplied setup function.
    this.settings.setup(this.context);
  }

  Track.prototype.render = function(playerContext) {
    //Get audio analysis info and add it to this.context.
    //Add current tracktime to this.context
    //pass context to this.settings.render(context);
    //set uniforms from this.context.uniforms
  }

  SF.player = new Player();  
})(SF || (SF = {}));
