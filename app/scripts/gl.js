var SF;
(function(SF) {
  var Graphics = SF.Graphics = function(canvas) {
    this.canvas = canvas;
  }
  Graphics.prototype.geometry = function() {
  }
  Graphics.prototype.init = function() {
    try { 
      this.gl = this.canvas.getContext('experimental-webgl');
    } catch(error) {}
    if(!this.gl) {
      throw("Cannot create WebGL context!!");
    }
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
        -1.0, 1.0
      ]), this.gl.STATIC_DRAW
    );
    
    var onWindowResize = function() {
      canvas.width = this.screenWidth = window.innerWidth;
      canvas.height = this.screenHeight = window.innerHeight;

      this.gl.viewPort(0,0,canvas.width, canvas.height);
    }
    window.addEventListener('resize', onWindowResize, false);
  }
  Graphics.prototype.setupProgram = function(vertex_shader, fragment_shader) {
    var program = this.gl.createProgram;

    var fragment_shader_preamble = "#ifdef GL_ES\nprecision highp float;\n#endif\n\n";

    var vs = createShader(vertex_shader, this.gl.VERTEX_SHADER);
    var fs = createShader(fragment_shader_preamble + fragment_shader, this.gl.VERTEX_SHADER);
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
  

  Graphics.prototype.render = function() {
    if(!this.program) return;


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



  //Pass in a canvas, extract a gl context, expose functions for setting uniforms, and rewise handlers.

})(SF || (SF = {}));
