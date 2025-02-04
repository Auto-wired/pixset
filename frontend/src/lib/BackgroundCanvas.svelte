<script lang="ts">
    import type { CanvasInfo, Position } from "../types";

    let { canvasInfo, position, pixelSize, zoomFactor, dpr }: { canvasInfo: CanvasInfo, position: Position, pixelSize: number, zoomFactor: number, dpr: number } = $props();
    let backgroundCanvas: HTMLCanvasElement;
    let boardCanvas: HTMLCanvasElement;
    let backgroundCanvasContext: CanvasRenderingContext2D;
    let boardCanvasContext: CanvasRenderingContext2D;

    function drawBackground (): void {
        const evenColor: string = "#777777";
        const oddColor: string = "#555555";
        const backgroundPixelSize: number = 12;

        for (let i: number = 0; i < Math.ceil(canvasInfo.width / backgroundPixelSize); i++) {
            backgroundCanvasContext.fillStyle = i % 2 === 0 ? evenColor : oddColor;

            for (let j: number = 0; j < Math.ceil(canvasInfo.height / backgroundPixelSize); j++) {
                backgroundCanvasContext.fillStyle = backgroundCanvasContext.fillStyle === evenColor ? oddColor : evenColor;

                backgroundCanvasContext.fillRect(i * backgroundPixelSize, j * backgroundPixelSize, backgroundPixelSize, backgroundPixelSize);
            }
        }
    }

    function drawBoard (): void {
        boardCanvasContext.fillStyle = "#dedede";
        
        boardCanvasContext.fillRect(0, 0, canvasInfo.width, canvasInfo.height);
        boardCanvasContext.translate(position.xTranslate, position.yTranslate);
        boardCanvasContext.clearRect(0, 0, pixelSize, pixelSize);
    }

    function initializeBackgroundCanvas (): void {
        const context: CanvasRenderingContext2D | null = backgroundCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        backgroundCanvasContext = context;

        backgroundCanvasContext.resetTransform();
        backgroundCanvasContext.scale(dpr, dpr);

        drawBackground();
    }

    function initializeBoardCanvas (): void {
        const context: CanvasRenderingContext2D | null = boardCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        boardCanvasContext = context;

        boardCanvasContext.resetTransform();
        boardCanvasContext.scale(zoomFactor * dpr, zoomFactor * dpr);

        drawBoard();
    }

    $effect((): void => {
        initializeBackgroundCanvas();
        initializeBoardCanvas();
    });
</script>

<canvas
    id="background-canvas"
    width={ canvasInfo.width * dpr }
    height={ canvasInfo.height * dpr }
    bind:this={ backgroundCanvas }>
</canvas>
<canvas
    id="board-canvas"
    width={ canvasInfo.width * dpr }
    height={ canvasInfo.height * dpr }
    bind:this={ boardCanvas }>
</canvas>

<style>
    #background-canvas, #board-canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>