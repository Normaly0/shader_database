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

    export let currentRotation : number;
    export let rotateModels = false;

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

    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
    camera.position.z = 6.0;
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

    let modelsGroup = new THREE.Group();
    let outlineGroup = new THREE.Group();

    const radius = 3;

    modelsGroup.position.z = 0 - radius;
    outlineGroup.position.z = 0 - radius;
 
    
    let sphere : THREE.Mesh;
    loader.load('sphere.glb', (gltf) => {
        sphere = gltf.scene.children[0] as THREE.Mesh;
        sphere.material = dynamicMaterial;
        sphere.position.y = 0;

        const outline = createOutline(sphere, new THREE.Vector3(0.0));
        outlineGroup.add(outline);

        modelsGroup.add(sphere);
    })

    let machine : THREE.Mesh;
    loader.load('machine.glb', (gltf) => {
        machine = gltf.scene.children[0] as THREE.Mesh;
        machine.material = dynamicMaterial;
        machine.position.y = 0;

        const outline = createOutline(machine, new THREE.Vector3(0.0));
        outlineGroup.add(outline);

        modelsGroup.add(machine);
    })

    let piston : THREE.Mesh;
    loader.load('piston.glb', (gltf) => {
        piston = gltf.scene.children[0] as THREE.Mesh;
        piston.material = dynamicMaterial;
        piston.position.y = 0;
        piston.scale.set(1.2, 1.2, 1.2);

        const outline = createOutline(piston, new THREE.Vector3(0.0));
        outlineGroup.add(outline);

        modelsGroup.add(piston);
    })

    scene.add(modelsGroup);

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
            scene.remove(outlineGroup)
            break;
        default:
            if (outlineGroup.parent === scene) break;
            scene.add(outlineGroup);
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
        controls.enablePan = false;
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

        //Animate models
        animateModelRotation();
        changeModelFocus(currentRotation);

        //Repeat

        window.requestAnimationFrame(tick);

    }

    onMount(() => {
        tick();
    })

    function changeModelFocus(rotation : number) {

        if (!machine) return

        let i = 0;

        modelsGroup.traverse((el) => {

            if (el.type === 'Group') return

            el.position.lerp(new THREE.Vector3(
            Math.cos((rotation + i) / 3 * Math.PI * 2 - .55) * radius,
            0.0, 
            Math.sin((rotation + i) / 3 * Math.PI * 2 - .55) * radius
            ), .1)

            i++;

        })

        outlineGroup.traverse((el) => {

            if (el.type === 'Group') return

            el.position.lerp(new THREE.Vector3(
            Math.cos((rotation + i) / 3 * Math.PI * 2 - .55) * radius,
            0.0, 
            Math.sin((rotation + i) / 3 * Math.PI * 2 - .55) * radius
            ), .1)

            i++;

        })
    }    

    function animateModelRotation() {
        if (!rotateModels) return

        modelsGroup.traverse(el => {
            if (el.type === 'Group') return
            el.rotation.y += 0.01;
        });

        outlineGroup.traverse(el => {
            if (el.type === 'Group') return
            el.rotation.y += 0.01;
        })
    }

</script>

<canvas class="webgl" bind:this={canvasRef}/>