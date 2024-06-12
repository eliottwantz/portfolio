<script lang="ts">
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
</script>

<div class="flex justify-center items-center">
    <button on:click={scrollToTop} class="italic text-sm transform hover:scale-105">Scroll to top</button>
</div>
