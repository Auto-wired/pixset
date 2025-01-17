<script lang="ts">
    import type { CanvasInfo, Position } from "../types";

    let lastPosition : null | Position = null;

    let { canvasInfo, position, pixelSize, zoomFactor, dpr }: { canvasInfo: CanvasInfo, position: Position, pixelSize: number, zoomFactor: number, dpr: number } = $props();
    let drawCanvas: HTMLCanvasElement;
    let drawCanvasContext: CanvasRenderingContext2D;
    let mainColor: string = $state("#00ff00");

    function onClick (event: MouseEvent): void {
        draw();
    }

    function onMouseMove (event: MouseEvent): void {
        const { buttons }: { buttons: number } = event;

        if (buttons === 1) {
            // draw();
            continuousDraw();

            lastPosition = {
                x: position.x,
                y: position.y,
                isOutOfCanvas: position.isOutOfCanvas,
            };
        }
    }

    function drawBoard (): void {
        const xTranslate: number = (canvasInfo.width / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor));
        const yTranslate: number = (canvasInfo.height / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor));

        drawCanvasContext.fillStyle = "#dedede";
        
        drawCanvasContext.fillRect(0, 0, canvasInfo.width, canvasInfo.height);
        drawCanvasContext.translate(xTranslate, yTranslate);
        drawCanvasContext.clearRect(0, 0, pixelSize, pixelSize);
    }

    function draw (x: number = position.x, y: number = position.y): void {
        if (x < 0 || x >= pixelSize || y < 0 || y >= pixelSize) {
            return;
        }

        drawCanvasContext.fillStyle = mainColor;

        drawCanvasContext.fillRect(x, y, 1, 1);
    }

    function continuousDraw (): void {
        if (lastPosition === null) {
            return;
        }

        const xOffset: number = position.x - lastPosition.x;
        const yOffset: number = position.y - lastPosition.y;
        const maxSize: number = Math.abs(xOffset) > Math.abs(yOffset) ? Math.abs(xOffset) : Math.abs(yOffset);
        const xDirection: number = xOffset === 0 ? 0 : xOffset > 0 ? 1 : -1;
        const yDirection: number = yOffset === 0 ? 0 : yOffset > 0 ? 1 : -1;
        const xIncreaseOffset: number = xOffset === 0 ? 0 : maxSize / Math.abs(xOffset);
        const yIncreaseOffset: number = yOffset === 0 ? 0 : maxSize / Math.abs(yOffset);

        let x: number = lastPosition.x;
        let y: number = lastPosition.y;

        for (let i: number = 0; i < maxSize; i++) {
            if (i % xIncreaseOffset < 1) {
                x += xDirection;
            }

            if (i % yIncreaseOffset < 1) {
                y += yDirection;
            }

            draw(x, y);
        }
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

    window.addEventListener("mouseup", (): void => {
        lastPosition = null;
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
    width={ canvasInfo.width * dpr }
    height={ canvasInfo.height * dpr }
    bind:this={ drawCanvas }
    onclick={ onClick }
    onmousemove={ onMouseMove }>
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