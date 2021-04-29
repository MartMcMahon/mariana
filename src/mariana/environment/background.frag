varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform highp vec4 inputSize;
uniform highp float resolution;
uniform highp vec4 outputFrame;

uniform mat3 cameraMatrix;
uniform float skyHeight;
uniform float waterDepth;

vec3 skyTopColor = vec3(0.0, 0.5, 1.0);
vec3 horizonColor = vec3(0.99, 0.99, 1.0);
vec3 waterTopColor = vec3(0.8, 0.9, 1.0);
vec3 waterBottomColor = vec3(0.0, 0.5, 1.0);


void main(void){
  gl_FragColor = texture2D(uSampler, vTextureCoord);

  vec2 screenPosition = vTextureCoord * inputSize.xy + outputFrame.xy;
  vec2 worldPosition = (cameraMatrix * vec3(screenPosition.xy, 1.0)).xy / resolution;

  float x = worldPosition.x; // meters
  float y = worldPosition.y; // meters

  if (y < 0.0) {
    gl_FragColor.xyz = mix(horizonColor, skyTopColor, -y / skyHeight);
  } else if (y < 3.0) {
    gl_FragColor.xyz = mix(horizonColor, waterTopColor, y / 3.0);
  } else {
    gl_FragColor.xyz = mix(waterTopColor, waterBottomColor, (y - 3.0) / waterDepth);
  }

  gl_FragColor.a = 1.0;
}