<script lang="ts">

  import { shaderID, shaders } from 'src/shaderStore';

  import Panel from 'src/components/Panel.svelte';
  import Canvas from 'src/components/Canvas.svelte';

  let focusedModel = 1;

  function focusModel(v : number) {
    focusedModel = Math.min(Math.max(focusedModel + v, 0), 2);;
  }
  
</script>

<main>

  <div class="title">
    <h1>{$shaders[$shaderID].name}</h1>
  </div>

  <Panel />
  
  <Canvas focusedModel={focusedModel} />

  <button on:click={() => focusModel(1)} class="btn-next">Next</button>
  <button on:click={() => focusModel(-1)} class="btn-prev">Prev</button>

</main>

<style>
  
</style>