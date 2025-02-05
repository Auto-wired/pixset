<script lang="ts">
    import type { CanvasInfo, CanvasOption, Position } from "../types";

    let { canvasInfo, canvasOption, position, dpr }: { canvasInfo: CanvasInfo, canvasOption: CanvasOption, position: Position, dpr: number } = $props();
    let overlayCanvas: HTMLCanvasElement;
    let overlayCanvasContext: CanvasRenderingContext2D;

    function onMouseMove (): void {
        drawOverlay();
    }

    function drawOverlay (): void {
        overlayCanvasContext.clearRect(0, 0, canvasInfo.width, canvasInfo.height);

        if (position.isOutOfCanvas) {
            return;
        }

        overlayCanvasContext.fillStyle = "rgba(255, 255, 255, 0.7)";

        overlayCanvasContext.fillRect(canvasInfo.xStart + (position.x * canvasOption.zoomFactor), canvasInfo.yStart + (position.y * canvasOption.zoomFactor), canvasOption.zoomFactor, canvasOption.zoomFactor);
    }

    $effect((): void => {        
        const context: CanvasRenderingContext2D | null = overlayCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        overlayCanvasContext = context;

        overlayCanvasContext.resetTransform();
        overlayCanvasContext.scale(dpr, dpr);

        drawOverlay();
    });
</script>

<canvas
    id="overlay-canvas"
    width={ canvasInfo.width * dpr }
    height={ canvasInfo.height * dpr }
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
        pointer-events: none;
    }
</style>