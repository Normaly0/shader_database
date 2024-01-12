import { readable, get } from "svelte/store";

export interface Shader {
    name: string,
    id: number,
    desc: string,
    vertexShader: string,
    fragmentShader: string
}

export const shaders = readable<{[key : number]: Shader}>({
    0 : {
        name: 'Dot grid shader',
        id: 0,
        desc: 'Lalalala',
        vertexShader: `void main() {
        
          //Position
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewMatrix * modelPosition;
        
          //Varyings
          vUv = uv;
        
          vModelPosition = vec3(modelMatrix * vec4(position, 1.0));
          vNormal = normalize(modelMatrix * vec4(normal, 0.0));
          
          vColor1 = uColor1;
          vColor2 = uColor2;
        }`,
        fragmentShader: `void main() {
          float strength = clamp(dot(vNormal.xyz, vec3(-1.0, 0.0, 0.5)), 0.0, 1.0);
          vec3 mixedColor = mix(vColor1, vColor2, strength);
    
          gl_FragColor = vec4(mixedColor, 1.0);
        }`
    },
    1 : {
        name: 'Fake Light Shader',
        id: 0,
        desc: 'Lalalala',
        vertexShader: `void main() {
        
          //Position
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewMatrix * modelPosition;
        
          //Varyings
          vUv = uv;
        
          vModelPosition = vec3(modelMatrix * vec4(position, 1.0));
          vNormal = normalize(modelMatrix * vec4(normal, 0.0));
          
          vColor1 = uColor1;
          vColor2 = uColor2;
        }`,
        fragmentShader: `void main() {
          float strength = clamp(dot(vNormal.xyz, vec3(-1.0, 0.0, 0.5)), 0.0, 1.0);
          vec3 mixedColor = mix(vColor1, vColor2, strength);
    
          gl_FragColor = vec4(mixedColor, 1.0);
        }`
    }
})

export const getShader = (id : number) => {
    const shaderStore = get(shaders);
    return shaderStore[id];
}