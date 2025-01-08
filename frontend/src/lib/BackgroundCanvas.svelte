<script lang="ts">
    import type { Size } from "../types";

    let { canvasSize }: { canvasSize: Size } = $props();
    let backgroundCanvas: HTMLCanvasElement;
    let backgroundCanvasContext: CanvasRenderingContext2D;

    function drawBackground (): void {
        // const backgroundCanvasContext = context;
        const evenColor: string = "#aaaaaa";
        const oddColor: string = "#777777";
        const backgroundPixelSize: number = 10;

        for (let i: number = 0; i < Math.ceil(canvasSize.width / backgroundPixelSize); i++) {
            backgroundCanvasContext.fillStyle = i % 2 === 0 ? evenColor : oddColor;

            for (let j: number = 0; j < Math.ceil(canvasSize.height / backgroundPixelSize); j++) {
                backgroundCanvasContext.fillStyle = backgroundCanvasContext.fillStyle === evenColor ? oddColor : evenColor;

                backgroundCanvasContext.fillRect(i * backgroundPixelSize, j * backgroundPixelSize, backgroundPixelSize, backgroundPixelSize);
            }
        }
    }

    $effect((): void => {
        const context: CanvasRenderingContext2D | null = backgroundCanvas.getContext("2d");

        if (context == null) {
            return;
        }

        backgroundCanvasContext = context;

        drawBackground();
    });
</script>

<canvas
    id="background-canvas"
    width={ canvasSize.width }
    height={ canvasSize.height }
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