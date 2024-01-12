<script lang="ts">


  import type { SvelteComponent } from 'svelte';

  import { type Shader, getShader } from 'src/shaderStore';
  import Toast from 'src/components/Toast.svelte';

  let toastRef : SvelteComponent;
  let menuRef : HTMLElement;

  let menu : boolean = false;
  let expandedAccordion : boolean | number = false;

  let shaderID : number = 0;
  let selectedShader : Shader = {
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

  $: if (!menu) {
    expandedAccordion = false;
  }

  function handleMenu() {
    if (!menu) {
      window.addEventListener('click', autoCloseMenu);
    } else {
      window.removeEventListener('click', autoCloseMenu);
    }

    menu = !menu;
  }

  function autoCloseMenu(e : MouseEvent) {
    if (menuRef.contains(e.target as HTMLElement)) return
    handleMenu();
  }

  function selectShader(e: MouseEvent) {
    
    const id = (e.target as HTMLButtonElement).dataset.id;
    const newShader = getShader(shaderID);

    shaderID = parseInt(id!);
    selectedShader = newShader;

  }

  function handleAccordion(id:number) {
    expandedAccordion === id
    ? expandedAccordion = false
    : expandedAccordion = id;
  }

  function copyToClipboard(shader : string) {
    navigator.clipboard.writeText(selectedShader[shader as keyof Shader] as string);
    toastRef.showToast();
  }

</script>

<div class="panel-position" data-menu={menu} bind:this={menuRef}>
  <div class="panel">
    <div class="panel-scroll">

      <div class="panel__list">
        <button class="panel__list-el" data-id=0 data-selectedShader={shaderID === 0 && true} on:click={selectShader}>
          <span />
        </button>
        <button class="panel__list-el" data-id=1 data-selectedShader={shaderID === 1 && true} on:click={selectShader}>
          <span />
        </button>
        <button class="panel__list-el" data-id=2 data-selectedShader={shaderID === 2 && true} on:click={selectShader}>
          <span />
        </button>
        <button class="panel__list-el" data-id=3 data-selectedShader={shaderID === 3 && true} on:click={selectShader}>
          <span />
        </button>
        <button class="panel__list-el" data-id=4 data-selectedShader={shaderID === 4 && true} on:click={selectShader}>
          <span />
        </button>
      </div>

      <div class="panel__txt">
        <p>{selectedShader.name}</p>
        <p>for the container but still ensure that the child element takes up 50% of the height, you need to ensure that
          the parent has a height value to base the percentage calculation on.
        </p>
      </div>

      <div class="panel__code">
        <p>Breach code...</p>

        <button on:click={()=> handleAccordion(0)} data-btn-active={expandedAccordion === 0 && true}>Vertex shader</button>
        <div class="panel__code-block" data-expanded={expandedAccordion===0 && true}>
          <div>
            <pre>
              <button class="btn-clipboard" on:click={() => copyToClipboard('vertexShader')} />
              {selectedShader.vertexShader}
            </pre>
          </div>
        </div>

        <button on:click={()=> handleAccordion(1)} data-btn-active={expandedAccordion === 1 && true}>Fragment shader</button>
        <div class="panel__code-block" data-expanded={expandedAccordion===1 && true}>
          <div>
            <pre>
              <button class="btn-clipboard" on:click={() => copyToClipboard('fragmentShader')}/>
              {selectedShader.fragmentShader}
            </pre>
          </div>
        </div>
      </div>

    </div>

    <span class="line-l" />
    <span class="line-l" />
  </div>
  <button class="btn-menu" on:click={handleMenu} data-btn-active={menu}>Database</button>
</div>

<Toast bind:this={toastRef}/>


<style lang="scss">
  @import 'src/styles/Panel.scss';
</style>