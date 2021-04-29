varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform highp vec4 inputSize;
uniform highp float resolution;
uniform highp vec4 outputFrame;

uniform mat3 cameraMatrix;
uniform vec3 waterColor;

// wave stuff
uniform highp float t;
uniform highp float a;
uniform highp float T;
uniform highp float lambda;

float PI2 = 2.0 * 3.1415926538;


void main(void){
  gl_FragColor = texture2D(uSampler, vTextureCoord);

  vec2 screenPosition = vTextureCoord * inputSize.xy + outputFrame.xy;
  vec2 worldPosition = (cameraMatrix * vec3(screenPosition.xy, 1.0)).xy / resolution;

  float x = worldPosition.x; // meters
  float y = worldPosition.y; // meters

  float wave1 = a * sin(PI2 * (x / lambda - t / T));

  float height = wave1;

  if (y < height) {
    // Transparent above the surface
    gl_FragColor = vec4(0.0);
  } else if (y < height + 0.05) {
    // surface foam
    gl_FragColor = vec4(1, 1, 1, 1) * 0.7;
  } else {
    gl_FragColor = vec4(waterColor, 1.0) * 0.35;
  }
}