var SF;
(function(SF) {
  "use strict";
  var Graphics = SF.Graphics = function(canvas) {
    this.canvas = canvas;
  };
  Graphics.prototype.geometry = function() {
  };
  Graphics.prototype.init = function() {
    try { 
      this.gl = this.canvas.getContext('experimental-webgl');
    } catch(error) {}
    if(!this.gl) {
      throw('Cannot create WebGL context!!');
    }
    var gl = this.gl;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
        -1.0, 1.0
      ]), this.gl.STATIC_DRAW
    );
    var self = this; 
    var onWindowResize = function() {
      canvas.width = self.screenWidth = window.innerWidth;
      canvas.height = self.screenHeight = window.innerHeight;

      gl.viewport(0,0,canvas.width, canvas.height);
    };
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
  };
  
  Graphics.prototype.setupProgram = function(vertex_shader, fragment_shader) {
    var program = this.gl.createProgram();

    var fragment_shader_preamble = "#ifdef GL_ES\nprecision highp float;\n#endif\n\n";

    var vs = this.createShader(vertex_shader, this.gl.VERTEX_SHADER);
    var fs = this.createShader(fragment_shader_preamble + fragment_shader, this.gl.FRAGMENT_SHADER);
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);

    this.gl.deleteShader(vs);
    this.gl.deleteShader(fs);

    this.gl.linkProgram(program);

    if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error("ERROR:\n" +
        "VALIDATE_STATUS:" + this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS) + "\n" +
        "ERROR:" + this.gl.getError() + "\n\n" +
        "- Vertex Shader -\n" + vertex + "\n\n" +
        "- Fragment Shader -\n" + fragment + "\n\n"
      );
      return null;
    }
    this.program = program;
  }
  Graphics.prototype.initializeAudioTexture = function(bufferLength) {
    var gl = this.gl;
    var texture = this.audioTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);  
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 512, 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    //setup texture and so on.
  }

  Graphics.prototype.updateAudioTexture = function (freqData, waveData) {
    var gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);  
    gl.bindTexture(gl.TEXTURE_2D, this.audioTexture);
    
    var waveLen = Math.min(waveData.length, 512);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 512,     1, gl.LUMINANCE, gl.UNSIGNED_BYTE, freqData);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 1, waveLen, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, waveData);
  }

  Graphics.prototype.render = function(uniforms) {
    if(!this.program) return;
    var gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.program);

    //Set uniforms
    for(var key in uniforms) {
      if(uniforms.hasOwnProperty(key)) {
        var uniform = uniforms[key];
        gl[uniform.type].apply(gl, 
            [gl.getUniformLocation(this.program, uniform.name)].concat( uniform.value)
        );
      }
    }

    //Immoral:
    var vertex_position = 0;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(vertex_position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(vertex_position);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(vertex_position);



  } 

  //Utils:
  Graphics.prototype.createShader = function(src, type) {
    var shader = this.gl.createShader(type);

    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);
    if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error((type == this.gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") +
        " SHADER\n" + this.gl.getShaderInfoLog(shader)
      );
      return null;
    }
    return shader;
  }


  Graphics.createUniform = function(name, type, value) {
    return {
      name: name,
      type: type,
      value: value
    };
  };
  //Pass in a canvas, extract a gl context, expose functions for setting uniforms, and rewise handlers.

})(SF || (SF = {}));
