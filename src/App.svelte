<script lang="ts">

  import { shaderID, shaders } from 'src/shaderStore';

  import Panel from 'src/components/Panel.svelte';
  import Canvas from 'src/components/Canvas.svelte';
  
</script>

<main>

  <div class="title">
    <h1>{$shaders[$shaderID].name}</h1>
  </div>

  <Panel />
  <Canvas />

</main>

<style>
  
</style>