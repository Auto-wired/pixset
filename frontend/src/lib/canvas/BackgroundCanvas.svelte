<script lang="ts">
    import { onMount, tick } from "svelte";
    import { canvasInfo, canvasOption } from "../../structures/shared.svelte";

    let { dpr }: { dpr: number } = $props();
    let backgroundCanvas: HTMLCanvasElement;
    let boardCanvas: HTMLCanvasElement;
    let backgroundCanvasContext: CanvasRenderingContext2D;
    let boardCanvasContext: CanvasRenderingContext2D;

    async function drawBackground (): Promise<void> {
        await tick();

        const evenColor: string = "#777777";
        const oddColor: string = "#555555";
        const backgroundPixelSize: number = 12;
        const resizingBackgroundPixelSize: number = backgroundPixelSize * dpr;

        for (let i: number = 0; i < Math.ceil(canvasInfo.width / backgroundPixelSize); i++) {
            backgroundCanvasContext.fillStyle = i % 2 === 0 ? evenColor : oddColor;

            for (let j: number = 0; j < Math.ceil(canvasInfo.height / backgroundPixelSize); j++) {
                backgroundCanvasContext.fillStyle = backgroundCanvasContext.fillStyle === evenColor ? oddColor : evenColor;

                backgroundCanvasContext.fillRect(i * resizingBackgroundPixelSize, j * resizingBackgroundPixelSize, resizingBackgroundPixelSize, resizingBackgroundPixelSize);
            }
        }
    }

    function drawBoard (): void {
        const resize: number = dpr * canvasOption.zoomFactor;

        boardCanvasContext.fillStyle = "#333333";
        
        boardCanvasContext.fillRect(0, 0, canvasInfo.width * dpr, canvasInfo.height * dpr);
        boardCanvasContext.translate(canvasInfo.xTranslate * resize, canvasInfo.yTranslate * resize);
        boardCanvasContext.clearRect(0, 0, canvasOption.width * resize, canvasOption.height * resize);
    }

    function initializeBackgroundCanvas (): void {
        backgroundCanvasContext = backgroundCanvas.getContext("2d") as CanvasRenderingContext2D;

        drawBackground();
    }

    function initializeBoardCanvas (): void {
        boardCanvasContext = boardCanvas.getContext("2d") as CanvasRenderingContext2D;

        boardCanvasContext.resetTransform();
        drawBoard();
    }

    $effect((): void => {
        initializeBoardCanvas();
    });

    onMount((): void => {
        initializeBackgroundCanvas();
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