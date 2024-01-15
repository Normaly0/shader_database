<script lang="ts">

    import { shaderID } from 'src/shaderStore';

    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

    import fakeLightVertex from 'src/shaders/fake_light/vertexShader.glsl';
    import fakeLightFragment from 'src/shaders/fake_light/fragmentShader.glsl';

    import toonLightVertex from 'src/shaders/toon_light/vertexShader.glsl';
    import toonLightFragment from 'src/shaders/toon_light/fragmentShader.glsl';

    const shaderParts = [
        [fakeLightVertex, fakeLightFragment],
        [toonLightVertex, toonLightFragment]
    ]

    let canvasRef : HTMLElement;

    //Scene

    const scene = new THREE.Scene();
    
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

    const cubeGeometry = new THREE.SphereGeometry(1);
    const dynamicMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uColor1: { value: new THREE.Color('#a56b7a') },
            uColor2: { value: new THREE.Color('#ffaad1') },
        }
    })
    $: {
        dynamicMaterial.vertexShader = shaderParts[$shaderID][0];
        dynamicMaterial.fragmentShader = shaderParts[$shaderID][1];
        dynamicMaterial.needsUpdate = true;
    }

    const cube = new THREE.Mesh(
        cubeGeometry,
        dynamicMaterial
    );

    scene.add(cube);

    //Renderer

    let renderer : any;

    $: if (canvasRef) {
        renderer = new THREE.WebGLRenderer({canvas: canvasRef!, alpha: true});

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
        renderer.render(scene, camera);
    };

    //Controls
    
    let controls : any;

    $: if(canvasRef) {
        controls = new OrbitControls(camera, canvasRef);
        controls.enableDamping = true;
    }

    //Animation

    const clock = new THREE.Clock();

    function tick() {

        const elapsedTime = clock.getElapsedTime();

        //Update Controls

        controls.update();

        //Render

        renderer.render(scene, camera);

        //Repeat

        window.requestAnimationFrame(tick);

    }

    $: if (renderer) {
        tick();
    }


</script>

<canvas class="webgl" bind:this={canvasRef}/>