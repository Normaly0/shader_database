<script lang="ts">

    let posXRef : HTMLDivElement;
    let posXtxt = '50.00'

    let posYRef : HTMLDivElement;
    let posYtxt = '50.00';

    window.addEventListener('mousemove', (e) => {
        let posX = parseInt((e.clientX / window.innerWidth * 100).toFixed(0));
        posX = Math.min(95, Math.max(5, posX));

        posXRef.style.left = `${posX}%`;
        posXtxt = (e.clientX / window.innerWidth * 100).toFixed(2);

        let posY = parseInt((e.clientY / window.innerHeight * 100).toFixed(0));
        posY = Math.min(93, Math.max(7, posY));

        posYRef.style.top = `${posY}%`;
        posYtxt = (e.clientY / window.innerHeight * 100).toFixed(2);
    })

</script>

<p class="posX" bind:this={posXRef}>
    posX - {posXtxt}
</p>

<p class="posY" bind:this={posYRef}>
    posY - {posYtxt}
</p>

<style lang="scss">
        
</style>