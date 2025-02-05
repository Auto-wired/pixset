<script lang="ts">
    import CanvasContainer from "./lib/CanvasContainer.svelte";
    import Inspector from "./lib/Inspector.svelte";
</script>

<main>
    <CanvasContainer></CanvasContainer>
    <Inspector></Inspector>
</main>

<style>
    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        /* background-color: #000000; */
    }
</style>
