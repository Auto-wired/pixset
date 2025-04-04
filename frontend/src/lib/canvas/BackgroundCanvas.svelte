<script lang="ts">
    import { canvasInfo, canvasOption } from "../../structures/shared.svelte";

    let { dpr }: { dpr: number } = $props();
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
        boardCanvasContext.fillStyle = "#333333";
        
        boardCanvasContext.fillRect(0, 0, canvasInfo.width, canvasInfo.height);
        boardCanvasContext.translate(canvasInfo.xTranslate, canvasInfo.yTranslate);
        boardCanvasContext.clearRect(0, 0, canvasOption.width, canvasOption.height);
    }

    function initializeBackgroundCanvas (): void {
        backgroundCanvasContext = backgroundCanvas.getContext("2d") as CanvasRenderingContext2D;

        backgroundCanvasContext.resetTransform();
        backgroundCanvasContext.scale(dpr, dpr);

        drawBackground();
    }

    function initializeBoardCanvas (): void {
        boardCanvasContext = boardCanvas.getContext("2d") as CanvasRenderingContext2D;

        boardCanvasContext.resetTransform();
        boardCanvasContext.scale(canvasOption.zoomFactor * dpr, canvasOption.zoomFactor * dpr);

        drawBoard();
    }

    $effect((): void => {
        initializeBackgroundCanvas();
    });

    $effect((): void => {
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