<script lang="ts">
    import type { CanvasInfo } from "../types";

    const dpr: number = window.devicePixelRatio;

    let { canvasInfo }: { canvasInfo: CanvasInfo } = $props();
    let backgroundCanvas: HTMLCanvasElement;
    let backgroundCanvasContext: CanvasRenderingContext2D;

    function drawBackground (): void {
        const evenColor: string = "#777777";
        const oddColor: string = "#555555";
        const backgroundPixelSize: number = 10;

        for (let i: number = 0; i < Math.ceil(canvasInfo.width / backgroundPixelSize); i++) {
            backgroundCanvasContext.fillStyle = i % 2 === 0 ? evenColor : oddColor;

            for (let j: number = 0; j < Math.ceil(canvasInfo.height / backgroundPixelSize); j++) {
                backgroundCanvasContext.fillStyle = backgroundCanvasContext.fillStyle === evenColor ? oddColor : evenColor;

                backgroundCanvasContext.fillRect(i * backgroundPixelSize, j * backgroundPixelSize, backgroundPixelSize, backgroundPixelSize);
            }
        }
    }

    $effect((): void => {
        const context: CanvasRenderingContext2D | null = backgroundCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        backgroundCanvasContext = context;

        backgroundCanvasContext.resetTransform();
        backgroundCanvasContext.scale(dpr, dpr);

        drawBackground();
    });
</script>

<canvas
    id="background-canvas"
    width={ `${ canvasInfo.width * dpr }` }
    height={ `${ canvasInfo.height * dpr }` }
    bind:this={ backgroundCanvas }>
</canvas>

<style>
    #background-canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>