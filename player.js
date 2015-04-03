(function() {
  "use script";
  var Player = function() {
    this.tracks = [];
    this.currentTrack = null;
    //Set up audio.
    
    this.audio  = { 
      context: new (window.audioContext || window.webkitAudioContext)(),
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
    this.audio.source = new Audio(track.path + "/" + track.audio);
    this.audio.sourceNode = this.audio.context.createMediaElementSource(this.audio.source);
    this.audio.sourceNode.connect(this.audio.analyser);
    this.audio.sourceNode.connect(this.audio.gain);
  }


  Player.prototype.playTrack = function(index) {
    var track = this.tracks[index];
    this.currentTrack = track;
    this.status = "playing";
    track.setup();
    track.play();
  }

  var Track = function(settings) {
    this.settings = settings;
    this.context = {
      uniforms: {}
    };
  }

  Track.prototype.setup = function(player) {
    //Run user supplied setup function.
    this.settings.setup(this.context);
  }

  Track.prototype.render = function(playerContext) {
    //Get audio analysis info and add it to this.context.
    //Add current tracktime to this.context
    //pass context to this.settings.render(context);
    //set uniforms from this.context.uniforms
  }

  
})();
