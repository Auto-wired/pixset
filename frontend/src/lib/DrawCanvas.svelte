<script lang="ts">
    import type { CanvasInfo, Position } from "../types";

    const dpr: number = window.devicePixelRatio;

    let { canvasInfo, position, pixelSize, zoomFactor }: { canvasInfo: CanvasInfo, position: Position, pixelSize: number, zoomFactor: number } = $props();
    let drawCanvas: HTMLCanvasElement;
    let drawCanvasContext: CanvasRenderingContext2D;
    let mainColor: string = $state("#00ff00");

    function onClick (event: MouseEvent): void {
        if (position.isOutOfCanvas) {
            return;
        }

        drawCanvasContext.fillStyle = mainColor;

        drawCanvasContext.fillRect(position.xSpace, position.ySpace, 1, 1);

        console.log(canvasInfo);
    }

    function drawBoard (): void {
        const xTranslate: number = (canvasInfo.width / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor));
        const yTranslate: number = (canvasInfo.height / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor));

        drawCanvasContext.fillStyle = "#ededed";
        
        drawCanvasContext.fillRect(0, 0, canvasInfo.width, canvasInfo.height);
        drawCanvasContext.translate(xTranslate, yTranslate);
        drawCanvasContext.clearRect(0, 0, pixelSize, pixelSize);
    }

    $effect((): void => {
        const context: CanvasRenderingContext2D | null = drawCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        drawCanvasContext = context;

        drawCanvasContext.resetTransform();
        drawCanvasContext.scale(zoomFactor * dpr, zoomFactor * dpr);

        drawBoard();
        // drawCenterLine();
    });

    // function drawCenterLine (): void {
    //     drawCanvasContext.strokeStyle = "#ff0000";

    //     drawCanvasContext.scale(1 / zoomFactor, 1 / zoomFactor);
    //     drawCanvasContext.beginPath();
    //     drawCanvasContext.moveTo(canvasInfo.width / 2, 0);
    //     drawCanvasContext.lineTo(canvasInfo.width / 2, canvasInfo.height);
    //     drawCanvasContext.stroke();
    //     drawCanvasContext.beginPath();
    //     drawCanvasContext.moveTo(0, canvasInfo.height / 2);
    //     drawCanvasContext.lineTo(canvasInfo.width, canvasInfo.height / 2);
    //     drawCanvasContext.stroke();
    // }
</script>

<canvas
    id="draw-canvas"
    width={ `${ canvasInfo.width * dpr }` }
    height={ `${ canvasInfo.height * dpr }` }
    bind:this={ drawCanvas }
    onclick={ onClick }>
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