var SF;
(function(SF) {
  "use strict";

  var Player = SF.Player = function(canvas) {
    this.tracks = [];
    this.currentTrack = null;
    //Set up audio.

    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audio = { 
      context: audioCtx,
      analyser: audioCtx.createAnalyser(),
      gain: audioCtx.createGain(),
      destination: audioCtx.destination
    }
    this.audio.gain.connect(this.audio.destination)

    //Wire up audio data.
    var analyser = this.audio.analyser;
    analyser.fftSize = 1024;
    var bufferLength = analyser.frequencyBinCount;
    this.audio.freqData = new Uint8Array(bufferLength);
    this.audio.waveData = new Uint8Array(bufferLength);

    //Set up graphics!
    this.gfx = new SF.Graphics(canvas);
    this.gfx.init();

    this.gfx.initializeAudioTexture(bufferLength);

  }

  Player.prototype.selectTrack = function(index) {
    var track = this.tracks[index];
    this.currentTrack = track;

    //I wonder if the audio should get wired up elsewhere but this is easy enough.
    //Wire up the audio stuff.
    this.audio.source = new Audio(track.path + "/" + track.settings.audio);
    this.audio.sourceNode = this.audio.context.createMediaElementSource(this.audio.source);
    this.audio.sourceNode.connect(this.audio.analyser);
    this.audio.sourceNode.connect(this.audio.gain);
    this.currentTrack.promise = this.currentTrack.setup(this);
  };

  Player.prototype.addTrack = function(path, settings) {
    var track = new Track(path, settings);
    this.tracks.push(track);
  };
  
  Player.prototype.play = function() {
    var track = this.currentTrack;
    this.status = "loading";
    var self = this;
    track.promise.done(function() {
      self.status = "playing"
      self.audio.source.play(); 
      self.animate();
    });
  };

  Player.prototype.animate = function() {
    if(this.status == "playing") {
      requestAnimationFrame(this.animate.bind(this));

      this.audio.analyser.getByteFrequencyData(this.audio.freqData);
      this.audio.analyser.getByteTimeDomainData(this.audio.waveData);
      this.gfx.updateAudioTexture(this.audio.freqData, this.audio.waveData);
      this.currentTrack.render(this);
    }
  };

  var Track = SF.Track = function(path, settings) {
    this.path = path;
    this.settings = settings;
    this.settings.context = {
      uniforms: {}
    };
  };
  
  Track.prototype.setup = function(player) {
    //Initialize the graphics context.
    //Hm. I'm going to need to retrieve the actual shader source.

    var vs = SF.Util.retrieve(this.path + "/" + this.settings.shaders.vertex);
    var fs = SF.Util.retrieve(this.path + "/" + this.settings.shaders.fragment);
    var self = this; 
    return Q.all([vs,fs]).spread(function(vs,fs) {
      player.gfx.setupProgram(vs, fs);
      
      //Run user supplied setup function.
      self.settings.setup && self.settings.setup(self.context);
      self.settings.context.uniforms.time = SF.Graphics.createUniform("time", "uniform1f", 0);
      self.settings.context.uniforms.resolution = SF.Graphics.createUniform("resolution", "uniform2f", [0,0]);
      return true;
    });

  };

  Track.prototype.render = function(player) {
    //Get audio analysis info and add it to this.context.
    //Add current tracktime to this.context
    //pass context to this.settings.render(context);
    //set uniforms from this.context.uniforms
    this.settings.context.uniforms.time.value = player.audio.source.currentTime;
    this.settings.context.uniforms.resolution.value = [player.gfx.screenWidth, player.gfx.screenHeight];
    this.settings.render && this.settings.render(settings.context);
    player.gfx.render(this.settings.context.uniforms);
  };

})(SF || (SF = {}));
