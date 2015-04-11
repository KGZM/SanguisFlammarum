playlist.addTrack('supertrack', {
  info: { //Not implemented.
    title: "Super Track",
    artist: "The Super Friends",
    date: "Blah.",
    notes: "Toughness."
  }, 
  shaders: {  // Done.
    vertex: 'whatever.glsl',
    fragment: 'blah.glsl'
  },
  audio: "staytough.mp3", //done
  setup: function(stuff) { //done
    doStuffTo(stuff);
    return stuff;
  },
  render: function(stuff) { //done
    stuff.setValue(toughness, 11);
  },
  teardown: function(stuff) {

  }
});



