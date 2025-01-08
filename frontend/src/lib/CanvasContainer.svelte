<script lang="ts">
    import BackgroundCanvas from "./BackgroundCanvas.svelte";
    import DrawCanvas from "./DrawCanvas.svelte";

    import type { Size } from "../types";

    let canvasContainer: HTMLElement;
    let canvasSize: Size = $state({
        width: 0,
        height: 0,
    });

    function setCanvasSize (): void {
        const { width, height } = canvasContainer.getBoundingClientRect();

        canvasSize.width = width;
        canvasSize.height = height;
    }

    $effect((): void => {
        setCanvasSize();
    });

    window.addEventListener("resize", (): void => {
        setCanvasSize();
    });
</script>

<div
    id="canvas-container"
    bind:this={ canvasContainer }>

    <BackgroundCanvas
        canvasSize={ canvasSize }>
    </BackgroundCanvas>

    <DrawCanvas
        canvasSize={ canvasSize }>
    </DrawCanvas>
    
</div>

<style>
    #canvas-container {
        width: 70%;
        height: 95%;
        position: relative;
        background-color: #ffffff;
    }
</style>