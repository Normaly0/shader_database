import { readable, writable } from "svelte/store";

export interface Shader {
  name: string,
  id: number,
  desc: string,
  vertexShader: string,
  fragmentShader: string
}

export const shaderID = writable(0);

export const shaders = readable<{ [key: number]: Shader }>({
  0: {
    name: 'Fake light',
    id: 0,
    desc: 'Shader mimicking a light source based on the dot product of a vector and the models normal.',
    vertexShader: `uniform vec3 uColor1;
      uniform vec3 uColor2;

      varying vec4 vNormal;

      varying vec3 vColor1;
      varying vec3 vColor2;

      void main() {
      
        //Position
    
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
    
        //Varyings
    
        vNormal = normalize(modelMatrix * vec4(normal, 0.0));
    
        vColor1 = uColor1;
        vColor2 = uColor2;
      }`,
    fragmentShader: `varying vec4 vNormal;

      varying vec3 vColor1;
      varying vec3 vColor2;
          
      void main() {
        float strength = clamp(dot(vNormal.xzy, vec3(-1.0, 0.5, 1.0)), 0.0, 1.0);
        vec3 mixedColor = mix(vColor1, vColor2, strength);
    
        gl_FragColor = vec4(mixedColor, 1.0);
    
        #include <colorspace_fragment>
      }`
  },
  1: {
    name: 'Toon shader',
    id: 0,
    desc: 'Tooon shader mimicking a light source based on the dot product of a vector and the models normal.',
    vertexShader: `uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    varying vec4 vNormal;
    
    varying vec3 vColor1;
    varying vec3 vColor2;
    
    void main() {
    
      //Position
  
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
  
      //Varyings
  
      vNormal = normalize(modelMatrix * vec4(normal, 0.0));
  
      vColor1 = uColor1;
      vColor2 = uColor2;
    }`,
    fragmentShader: `varying vec4 vNormal;

    varying vec3 vColor1;
    varying vec3 vColor2;
    
    void main() {
      float angle = clamp(dot(vNormal.xyz, vec3(-1.0, 0.5, 0.5)), 0.0, 1.0);
      float strength = floor(angle * 3.0) / 3.0;
      vec3 mixedColor = mix(vColor1, vColor2, strength);
  
      gl_FragColor = vec4(mixedColor, 1.0);
  
      #include <colorspace_fragment>;
    }`
  },
  2: {
    name: 'Emissive stripes',
    id: 0,
    desc: 'Toon shader with emissive stripes wrapping around the body of the model',
    vertexShader: `uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    varying vec4 vNormal;
    varying vec3 vModelPosition;
    
    varying vec3 vColor1;
    varying vec3 vColor2;
    
    void main() {
    
      //Position
  
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
  
      //Varyings
  
      vNormal = normalize(modelMatrix * vec4(normal, 0.0));
      vModelPosition = vec3(modelMatrix * vec4(position, 1.0));
  
      vColor1 = uColor1;
      vColor2 = uColor2;
    }`,
    fragmentShader: `varying vec3 vModelPosition;
    varying vec4 vNormal;
    
    varying vec3 vColor1;
    varying vec3 vColor2;
    
    void main() {
        
      float pattern = cnoise(vec3(vModelPosition.x * 0.8, vModelPosition.y * 15.0, vModelPosition.z * 0.8));
      pattern -= 0.2;
      pattern *= 5.0;
      pattern = clamp(pattern, 0.0, 5.0);
      pattern = step(0.3, pattern);
  
      float cellshading = dot(vNormal.xzy, vec3(-1.0, 0.51, 1.0));
      cellshading = step(0.5, cellshading);
  
      vec3 ColorShadow = vec3(0.56, 0.07, 0.00);
      vec3 ColorHighlight = vec3(0.79, 0.18, 0.06);
      vec3 ColorEmissive = vec3(1.3, 0.77, 0.76);
  
      vec3 baseColor = mix(ColorShadow, ColorHighlight, cellshading);
      vec3 finalColor = mix(baseColor, ColorEmissive, pattern);
  
      gl_FragColor = vec4(finalColor, 1.0);
  
      #include <colorspace_fragment>;
        
    }`
  },
  3: {
    name: 'Dot shading',
    id: 0,
    desc: 'Toon shader with emissive stripes wrapping around the body of the model',
    vertexShader: `uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    varying vec4 vNormal;
    varying vec3 vModelPosition;
    
    varying vec3 vColor1;
    varying vec3 vColor2;
    
    void main() {
    
      //Position
  
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
  
      //Varyings
  
      vNormal = normalize(modelMatrix * vec4(normal, 0.0));
      vModelPosition = vec3(modelMatrix * vec4(position, 1.0));
  
      vColor1 = uColor1;
      vColor2 = uColor2;
    }`,
    fragmentShader: `varying vec3 vModelPosition;
    varying vec4 vNormal;
    
    varying vec3 vColor1;
    varying vec3 vColor2;
    
    float circle(vec3 point, float radius) {
    
      vec2 grid = fract(gl_FragCoord.xy / 500.0 * 15.0);
      float circle = 1.0 - distance(grid, vec2(0.5));
      circle -= radius;
      circle = clamp(circle, 0.0, 1.0);
      circle = step(0.2, circle);
      
      return circle;
    }
    
    void main() {
      float angle = clamp(dot(vNormal.xyz, vec3(-1.0, 1.0, 1.0)), 0.0, 1.0);
      float pattern = circle(vModelPosition.xzy, 1.0 - angle);
  
      vec3 Color1 = vec3(0.02, 0.27, 0.83);
      vec3 Color2 = vec3(0.14, 0.56, 0.89);
      vec3 mixedColor = mix(Color1, Color2, pattern);
  
      gl_FragColor = vec4(mixedColor, 1.0);
  
      #include <colorspace_fragment>;
    }`
  },
  4: {
    name: 'Scrible shader',
    id: 0,
    desc: 'Stylized hand drawn shader with several color levels',
    vertexShader: `uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    varying vec4 vNormal;
    varying vec3 vModelPosition;
    
    varying vec3 vColor1;
    varying vec3 vColor2;
    
    void main() {
    
      //Position
  
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
  
      //Varyings
  
      vNormal = normalize(modelMatrix * vec4(normal, 0.0));
      vModelPosition = vec3(modelMatrix * vec4(position, 1.0));
  
      vColor1 = uColor1;
      vColor2 = uColor2;
    }`,
    fragmentShader: `varying vec3 vModelPosition;
    varying vec4 vNormal;
    
    varying vec3 vColor1;
    varying vec3 vColor2;
    
    mat3 rotateMatrix(float angle) {
      return mat3(
          cos(angle), -sin(angle), 0.0,
          sin(angle), cos(angle), 0.0,
          0.0, 0.0, 1.0
      );
    }
    
    void main() {
    
      float angle = dot(vNormal.xzy, vec3(-1.0, 0.3, 1.5));
      angle *= 3.0;
  
      mat3 rotationMatrix = rotateMatrix(radians(-40.0));
      vec3 rotatedCoords = rotationMatrix * vModelPosition;
  
      float noise = cnoise(vec3(rotatedCoords.x * 10.0, rotatedCoords.y * 200.0, rotatedCoords.z * 10.0));
      noise = noise - angle;
      noise = 1.0 - noise - 1.3;
      noise *= 50.0;
      noise = clamp(noise, 0.0, 1.0);
  
      float noiseHighlights = cnoise(vec3(rotatedCoords.x * 10.0, rotatedCoords.y * 200.0, rotatedCoords.z * 10.0));
      float offsetAngle = (angle - 2.2) * 2.0;
      noiseHighlights = noiseHighlights - offsetAngle;
      noiseHighlights = 1.0 - noiseHighlights;
      noiseHighlights *= 50.0;
      noiseHighlights = clamp(noiseHighlights, 0.0, 1.0);
  
      vec3 colorBase = vec3(0.00, 0.13, 0.26);
      vec3 colorMid = vec3(0.11, 0.55, 0.86);
      vec3 colorHighlights = vec3(0.39, 0.85, 1.00);
  
      vec3 finalColor = mix(colorBase, colorMid, clamp(noise, 0.0, 1.0));
      finalColor = mix(finalColor, colorHighlights, noiseHighlights);
      
      gl_FragColor = vec4(finalColor, 1.0);
    
    }`
  },
  5: {
    name: 'Energy bubble',
    id: 0,
    desc: 'An enegy shader with a fresnel fadeout and emissive rim',
    vertexShader: `uniform vec3 uCameraPosition;

    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    varying vec4 vNormal;
    varying vec3 vModelPosition;
    varying vec3 vCameraPosition;
    
    varying vec3 vColor1;
    varying vec3 vColor2;
    
    void main() {
    
      //Position
  
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
  
      //Varyings
  
      vNormal = normalize(modelMatrix * vec4(normal, 0.0));
      vModelPosition = vec3(modelMatrix * vec4(position, 1.0));
      vCameraPosition =  uCameraPosition;
  
      vColor1 = uColor1;
      vColor2 = uColor2;
    }`,
    fragmentShader: `varying vec3 vModelPosition;
    varying vec4 vNormal;
    varying vec3 vCameraPosition;
    
    varying vec3 vColor1;
    varying vec3 vColor2;
    
    void main() {
    
      vec3 viewDirection = normalize(cameraPosition - vModelPosition);
      float fresnel = dot(viewDirection, vNormal.xyz);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = smoothstep(0.4, 1.0, fresnel);
  
      vec3 colorEmissive = vec3(2.2, 0.5, 0.0);
      vec3 colorBase = vec3(1.00, 0.72, 0.28);
      vec3 colorMix = mix(colorBase, colorEmissive, fresnel);
  
      gl_FragColor = vec4(colorMix, clamp(fresnel, 0.2, 1.0))
  
      #include <colorspace_fragment>
    
    }`
  }
})