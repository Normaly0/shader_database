<script lang="ts">

  import { shaderID, shaders } from 'src/shaderStore';

  import Panel from 'src/components/Panel.svelte';
  import Canvas from 'src/components/Canvas.svelte';

  let currentRotation = 0;
  let rotateModels = false;
  
</script>

<main>

  <div class="title">
    <h1>{$shaders[$shaderID].name}</h1>
  </div>

  <Panel />
  
  <Canvas currentRotation={currentRotation} rotateModels={rotateModels} />

  <button on:click={() => currentRotation++} class="btn-next">Next</button>
  <button on:click={() => currentRotation--} class="btn-prev">Prev</button>
  <button on:click={() => rotateModels = !rotateModels} class="btn-spin">SPIN!</button>

</main>

<style>
  
</style>