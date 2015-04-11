uniform float time;
uniform vec2 resolution;
uniform sampler2D audioData;
void main(void) {
  vec2 position = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
  vec2 uv=gl_FragCoord.xy / resolution.xy;
  vec2 center = (uv.xy - 0.5) * 2.0;

  float symmetric = max(abs(uv.x - 0.5) - 0.001, 0.01) * 1.0;
  float linear = uv.x * 0.9;
  //uv.x = mix(symmetric, linear, sin(iGlobalTime * 0.125) / 2.0 + 0.5);

  //Both are kind of fun for different reasons.
  //if(mod(iGlobalTime, 30.0) < 15.0) {
  uv.x = symmetric;
  //} else {
  //    uv.x = linear;
  //}
  float freq0 = texture2D(audioData, vec2(uv.x, 0.25)).x;    
  float freq1 = texture2D(audioData, vec2(uv.x + 0.01, 0.25)).x;
  float freq2 = texture2D(audioData, vec2(uv.x - 0.01, 0.25)).x;
  float theta = atan(uv.y, uv.x);
  float shrinkFactor = 3.0;
  float solidColorWidth = 2.5;
  float realcenter = (1.0 - abs(center.y));;
  center.y = mod(abs(center.y) * 10.0, 0.4);
  center.y = 1.0 - center.y * shrinkFactor;

  center.y = clamp(center.y * solidColorWidth, 0.0, 1.0);
  float spectrum = center.y * (freq0 + freq1 + freq2 / 3.0) * (realcenter * 0.75);
  //mix(realcenter, 0.5, 1.0 - uv.x);
  vec4 spectrumColor = vec4(
      mod(spectrum * 3.0, 2.0) * 1.0,
      mod(spectrum * 4.0, 3.0) * 1.0,
      mod(spectrum * 4.0, 4.0) * 1.0,
      1.0);
  gl_FragColor = mix(spectrumColor * realcenter,
      vec4(1.0 * freq0 * realcenter * (sin(time * 2.0) + 1.0),
        (1.0 - abs(center.x)) * freq0 * 2.0 * realcenter,realcenter * freq0,1.0),
      (sin(time / 4.0) + 1.0) * freq0
      );
}
