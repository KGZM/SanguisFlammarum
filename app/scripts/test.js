var canvas = $('canvas')[0];
var player =  new SF.Player(canvas);
player.addTrack('tracks', {
  audio: 'schemecorps-rawjam-thecall.ogg',
  shaders: {
    vertex: 'vertex.glsl',
    fragment: 'fragment.glsl'
  },
});

player.selectTrack(0);
player.play();
