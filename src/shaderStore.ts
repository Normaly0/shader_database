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
    
        float cellshading = dot(vNormal.xzy, vec3(-1.0, 0.5, 1.0));
        cellshading = step(0.5, cellshading);
    
        vec3 ColorShadow = vec3(0.56, 0.07, 0.00);
        vec3 ColorHighlight = vec3(0.79, 0.18, 0.06);
        vec3 ColorEmissive = vec3(1.3, 0.77, 0.76);
    
        vec3 baseColor = mix(ColorShadow, ColorHighlight, cellshading);
        vec3 finalColor = mix(baseColor, ColorEmissive, pattern);
    
        gl_FragColor = vec4(finalColor, 1.0);
    
        #include <colorspace_fragment>;
        
    }`
  }
})