<script lang="ts">

  import { shaderID, shaders } from 'src/shaderStore';

  import Panel from 'src/components/Panel.svelte';
  import Canvas from 'src/components/Canvas.svelte';
  import UI from 'src/components/UI.svelte';

  let currentRotation = 0;
  let rotateModels = false;
  
</script>

<main>

  <div class="title">
    <h1>{$shaders[$shaderID].name}</h1>
  </div>

  <Panel />
  <UI />
  
  <Canvas currentRotation={currentRotation} rotateModels={rotateModels} />

  <button on:click={() => currentRotation++} class="btn-next">Next</button>
  <button on:click={() => currentRotation--} class="btn-prev">Prev</button>
  <button on:click={() => rotateModels = !rotateModels} class={`btn-spin ${rotateModels && 'btn-spin--active'}`}>SPIN!</button>

</main>

<style lang="scss">
  @use 'src/styles/App.scss';
</style>