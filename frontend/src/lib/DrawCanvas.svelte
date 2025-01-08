<script lang="ts">
    import type { Size } from "../types";

    let { canvasSize }: { canvasSize: Size } = $props();
    let drawCanvas: HTMLCanvasElement;
    let drawCanvasContext: CanvasRenderingContext2D;
    let pixelSize: number = $state(32);
    // let mainColor: string = $state("#ffffff");
    let zoomFactor: number = $state(1);

    function drawBoard (): void {
        const xTranslate: number = (canvasSize.width / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor));
        const yTranslate: number = (canvasSize.height / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor));

        drawCanvasContext.fillStyle = "#dddddd";
        
        drawCanvasContext.fillRect(0, 0, canvasSize.width, canvasSize.height);
        drawCanvasContext.translate(xTranslate, yTranslate);
        drawCanvasContext.clearRect(0, 0, pixelSize, pixelSize);
        drawCanvasContext.translate(-xTranslate, -yTranslate);
    }

    function onWheel (event: WheelEvent): void {
        const { deltaY } = event;

        if (deltaY < 0) {
            zoomFactor += 1;
        } else {
            zoomFactor -= 1;
        }

        if (zoomFactor < 1) {
            zoomFactor = 1;
        } else if (zoomFactor > 15) {
            zoomFactor = 15;
        }
    }

    $effect((): void => {
        const context: CanvasRenderingContext2D | null = drawCanvas.getContext("2d");

        if (context !== null) {
            drawCanvasContext = context;

            drawCanvasContext.resetTransform();
            drawCanvasContext.scale(zoomFactor, zoomFactor);
        }

        drawBoard();
        // drawCenterLine();
    });

    // function drawCenterLine (): void {
    //     drawCanvasContext.strokeStyle = "#ff0000";

    //     drawCanvasContext.scale(1 / zoomFactor, 1 / zoomFactor);
    //     drawCanvasContext.beginPath();
    //     drawCanvasContext.moveTo(canvasSize.width / 2, 0);
    //     drawCanvasContext.lineTo(canvasSize.width / 2, canvasSize.height);
    //     drawCanvasContext.stroke();
    //     drawCanvasContext.beginPath();
    //     drawCanvasContext.moveTo(0, canvasSize.height / 2);
    //     drawCanvasContext.lineTo(canvasSize.width, canvasSize.height / 2);
    //     drawCanvasContext.stroke();
    // }
</script>

<canvas
    id="draw-canvas"
    width={ canvasSize.width }
    height={ canvasSize.height }
    bind:this={ drawCanvas }
    onwheel={ onWheel }>
</canvas>

<style>
    #draw-canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
</style>