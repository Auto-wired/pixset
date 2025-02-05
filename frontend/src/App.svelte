<script lang="ts">
    import Toolbar from "./lib/toolbar/Toolbar.svelte";
    import CanvasContainer from "./lib/canvas/CanvasContainer.svelte";
    import Inspector from "./lib/inspector/Inspector.svelte";
</script>

<main>
    <Toolbar></Toolbar>
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
