<script lang="ts">

  import Panel from 'src/components/Panels.svelte';

  interface Shader {
    name: string,
    id: number,
    desc: string,
    vertexShader: string,
    fragmentShader: string
  }

  const selectedShader : Shader = {
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
  }

  let expandedAccordion : boolean | number = false;

  function handleAccordion(id:number) {
    expandedAccordion === id
    ? expandedAccordion = false
    : expandedAccordion = id;
  }
  
</script>

<main>

  <div class="title">
    <h1>Comic Dot Shader</h1>
  </div>

  <div class="webgl"></div>

  <Panel />

</main>

<style>
  
</style>