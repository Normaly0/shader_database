<script lang="ts">

    import { onMount } from 'svelte';
    import { shaderID } from 'src/shaderStore';

    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

    import fakeLightVertex from 'src/shaders/fake_light/vertexShader.glsl';
    import fakeLightFragment from 'src/shaders/fake_light/fragmentShader.glsl';

    import toonLightVertex from 'src/shaders/toon_light/vertexShader.glsl';
    import toonLightFragment from 'src/shaders/toon_light/fragmentShader.glsl';

    import stripesVertex from 'src/shaders/emissive_stripes/vertexShader.glsl';
    import stripesFragment from 'src/shaders/emissive_stripes/fragmentShader.glsl';

    import dotShadingVertex from 'src/shaders/dot_shading/vertexShader.glsl';
    import dotShadingFragment from 'src/shaders/dot_shading/fragmentShader.glsl';

    import scribleVertex from 'src/shaders/scrible_shading/vertexShader.glsl';
    import scribleFragment from 'src/shaders/scrible_shading/fragmentShader.glsl';

    import energyBubbleVertex from 'src/shaders/energy_bubble/vertexShader.glsl';
    import energyBubbleFragment from 'src/shaders/energy_bubble/fragmentShader.glsl';

    const shaderParts = [
        [fakeLightVertex, fakeLightFragment],
        [toonLightVertex, toonLightFragment],
        [stripesVertex, stripesFragment],
        [dotShadingVertex, dotShadingFragment],
        [scribleVertex, scribleFragment],
        [energyBubbleVertex, energyBubbleFragment],
    ];

    let canvasRef : HTMLCanvasElement;

    //Scene

    const scene = new THREE.Scene();
    $: switch($shaderID) {
        case 2:
        case 5:
            scene.background = new THREE.Color('#59AEFF');
            break;
        default: 
            scene.background = null;
            break;
    }
    
    //Sizes

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    //Camera

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    //Models

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.dracoLoader = dracoLoader;

    function createOutline(model : THREE.Mesh, color : THREE.Vector3) {
        
        const outline = model.clone();
        
        outline.material = new THREE.ShaderMaterial({
            vertexShader: `
              void main() {
                vec3 outlinePosition = position + normal * 0.005;
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(outlinePosition, 1.0);
              }
            `,
            fragmentShader: `
              void main() {
                gl_FragColor = vec4(${color.x}, ${color.y}, ${color.z}, 1.0);
              }
            `,
            side: THREE.BackSide
        })

        return outline;
    }

    let sphere : THREE.Mesh;
    let outline : THREE.Mesh;

    loader.load('sphere.glb', (gltf) => {
        sphere = gltf.scene.children[0] as THREE.Mesh;
        sphere.material = dynamicMaterial;

        outline = createOutline(sphere, new THREE.Vector3(0.0));

        scene.add(sphere);
    })

    const dynamicMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            uColor1: { value: new THREE.Color('#a56b7a') },
            uColor2: { value: new THREE.Color('#ffaad1') },
            uCameraPosition: { value: camera.position }
        }
    })

    $: {
        dynamicMaterial.vertexShader = shaderParts[$shaderID][0];
        dynamicMaterial.fragmentShader = shaderParts[$shaderID][1];
        dynamicMaterial.needsUpdate = true;
    }

    $: switch($shaderID) {
        case 5:
            scene.remove(outline);
            break;
        default:
            if (!outline) break;
            scene.add(outline);
            break;
    }

    //Renderer

    let renderer : any;

    onMount(() => {
        renderer = new THREE.WebGLRenderer({canvas: canvasRef, alpha: true});
    
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
        renderer.render(scene, camera);
    })

    //Post proccessing
    
    let effectComposer : any;
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(sizes.width, sizes.height),
        0.7,
        0.5,
        0.85
    )

    onMount(() => {
        effectComposer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        effectComposer.addPass(renderPass);
    });

    
    $: if (effectComposer) {
        switch($shaderID) {
            case 2:
            case 5:
            if (effectComposer.passes.includes(bloomPass)) break;
            effectComposer.addPass(bloomPass);
            break;
        default:
            effectComposer.removePass(bloomPass);
            break;
        }
    }

    //Controls
    
    let controls : any;

    onMount(() => {
        controls = new OrbitControls(camera, canvasRef);
        controls.enableDamping = true;
    })

    //Animation

    const clock = new THREE.Clock();

    function tick() {

        const elapsedTime = clock.getElapsedTime();

        //Update Controls

        controls.update();

        //Render

        // renderer.render(scene, camera);
        effectComposer.render()

        //Repeat

        window.requestAnimationFrame(tick);

    }

    onMount(() => {
        tick();
    })

</script>

<canvas class="webgl" bind:this={canvasRef}/>