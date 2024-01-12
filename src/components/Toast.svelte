<script lang="ts">
    let toast = false;

    export function showToast() {
        toast = true;
        setTimeout(() => {
            toast = false;
        }, 2000)
    }
    
</script>

<div class="toast" data-toast={toast}>
    <p>Code stolen!</p>
</div>

<style lang="scss">
    @import 'src/styles/Toast.scss';
</style>