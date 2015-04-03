playlist.addTrack('supertrack', {
  info: {
    title: "Super Track",
    artist: "The Super Friends",
    date: "Blah.",
    notes: "Toughness."
  },
  shaders: ['whatever.glsl', 'blah.glsl'],
  audio: "staytough.mp3",
  setup: function(stuff) {
    doStuffTo(stuff);
    return stuff;
  },
  render: function(stuff) {
    stuff.setValue(toughness, 11);
  },
  teardown: function(stuff) {

  }
});



