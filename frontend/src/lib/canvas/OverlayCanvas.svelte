<script lang="ts">
    import { canvasInfo, canvasOption, position } from "../../structures/shared.svelte";

    let { dpr }: { dpr: number } = $props();
    let overlayCanvas: HTMLCanvasElement;
    let overlayCanvasContext: CanvasRenderingContext2D;

    function drawOverlay (): void {
        overlayCanvasContext.clearRect(0, 0, canvasInfo.width, canvasInfo.height);

        if (position.isOutOfCanvas) {
            return;
        }

        overlayCanvasContext.fillStyle = "rgba(255, 255, 255, 0.7)";

        overlayCanvasContext.fillRect(canvasInfo.xStart + (position.x * canvasOption.zoomFactor), canvasInfo.yStart + (position.y * canvasOption.zoomFactor), canvasOption.zoomFactor, canvasOption.zoomFactor);
    }

    function initializeOverlayCanvas (): void {
        overlayCanvasContext = overlayCanvas.getContext("2d") as CanvasRenderingContext2D;
        overlayCanvas.style.visibility = canvasInfo.overlayCanvasVisibility ? "visible" : "hidden";

        overlayCanvasContext.resetTransform();
        overlayCanvasContext.scale(dpr, dpr);

        drawOverlay();
    }

    $effect((): void => {
        initializeOverlayCanvas();
    });
</script>

<canvas
    id="overlay-canvas"
    width={ canvasInfo.width * dpr }
    height={ canvasInfo.height * dpr }
    bind:this={ overlayCanvas }
    onmousemove={ drawOverlay }>
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