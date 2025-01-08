<script lang="ts">
    import type { Size } from "../types";

    let { canvasSize }: { canvasSize: Size } = $props();
    let overlayCanvas: HTMLCanvasElement;
    let overlayCanvasContext: CanvasRenderingContext2D;

    $effect((): void => {
        const context: CanvasRenderingContext2D | null = overlayCanvas.getContext("2d");

        if (context == null) {
            return;
        }

        overlayCanvasContext = context;
    });
</script>

<canvas
    id="overlay-canvas"
    width={ canvasSize.width }
    height={ canvasSize.height }
    bind:this={ overlayCanvas }>
</canvas>

<style>
    #overlay-canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }
</style>