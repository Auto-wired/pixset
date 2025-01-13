<script lang="ts">
    import type { Position, CanvasInfo } from "../types";

    let { canvasInfo, zoomFactor, position }: { canvasInfo: CanvasInfo, zoomFactor: number, position: Position | null } = $props();
    let overlayCanvas: HTMLCanvasElement;
    let overlayCanvasContext: CanvasRenderingContext2D;

    function onMouseMove (): void {
        drawOverlay();
    }

    function drawOverlay (): void {
        overlayCanvasContext.clearRect(0, 0, canvasInfo.width, canvasInfo.height);

        if (position === null) {
            return;
        }

        overlayCanvasContext.fillStyle = "rgba(255, 255, 255, 0.7)";

        overlayCanvasContext.fillRect(canvasInfo.xStart + (position.xSpace * zoomFactor), canvasInfo.yStart + (position.ySpace * zoomFactor), zoomFactor, zoomFactor);
    }

    $effect((): void => {
        const context: CanvasRenderingContext2D | null = overlayCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        overlayCanvasContext = context;

        drawOverlay();
    });
</script>

<canvas
    id="overlay-canvas"
    width={ `${ canvasInfo.width }` }
    height={ `${ canvasInfo.height }` }
    bind:this={ overlayCanvas }
    onmousemove={ onMouseMove }>
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