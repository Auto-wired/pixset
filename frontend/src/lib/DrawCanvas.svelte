<script lang="ts">
    import type { CanvasInfo, CanvasOption, Position } from "../types";

    let lastPosition : null | Position = null;

    let { canvasInfo, canvasOption, position, dpr }: { canvasInfo: CanvasInfo, canvasOption: CanvasOption, position: Position, dpr: number } = $props();
    let drawCanvas: HTMLCanvasElement;
    let saveCanvas: HTMLCanvasElement;
    let drawCanvasContext: CanvasRenderingContext2D;
    let saveCanvasContext: CanvasRenderingContext2D;
    let mainColor: string = $state("#00ff00");

    function onClick (event: MouseEvent): void {
        draw();
        saveDrawCanvas();
    }

    function onMouseMove (event: MouseEvent): void {
        const { buttons }: { buttons: number } = event;

        switch (buttons) {
            case 1:
                draw();

                break;
            case 2:
                erase();

                break;
            default:
                return;
        }

        continuousAction(buttons);
        saveDrawCanvas();

        lastPosition = {
            x: position.x,
            y: position.y,
            isOutOfCanvas: position.isOutOfCanvas,
        };
    }

    function onContextMenu (event: MouseEvent): void {
        event.preventDefault();
        erase();
        saveDrawCanvas();
    }

    function draw (x: number = position.x, y: number = position.y): void {
        if (x < 0 || x >= canvasOption.pixelSize || y < 0 || y >= canvasOption.pixelSize) {
            return;
        }

        drawCanvasContext.fillStyle = mainColor;

        drawCanvasContext.fillRect(x, y, 1, 1);
    }

    function continuousAction (actionType: number): void {
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

            if (actionType === 1) {
                draw(x, y);
            } else if (actionType === 2) {
                erase(x, y);
            }
        }
    }

    function erase (x: number = position.x, y: number = position.y): void {
        drawCanvasContext.clearRect(x, y, 1, 1);
    }

    async function saveDrawCanvas (): Promise<void> {
        if (canvasInfo.width === 0 || canvasInfo.height === 0 || canvasInfo.xStart === 0 || canvasInfo.yStart === 0) {
            return;
        }

        const imageData: ImageData = drawCanvasContext.getImageData(canvasInfo.xStart * dpr, canvasInfo.yStart * dpr, (canvasInfo.xEnd - canvasInfo.xStart) * dpr, (canvasInfo.yEnd - canvasInfo.yStart) * dpr);
        const imageBitmap: ImageBitmap = await window.createImageBitmap(imageData, {
            resizeWidth: canvasOption.pixelSize,
            resizeHeight: canvasOption.pixelSize,
        });

        saveCanvasContext.clearRect(0, 0, canvasOption.pixelSize, canvasOption.pixelSize);
        saveCanvasContext.drawImage(imageBitmap, 0, 0);
    }

    async function restoreDrawCanvas (): Promise<void> {
        const imageData: ImageData = saveCanvasContext.getImageData(0, 0, canvasOption.pixelSize, canvasOption.pixelSize);
        const imageBitmap: ImageBitmap = await window.createImageBitmap(imageData);

        drawCanvasContext.clearRect(-canvasInfo.xTranslate, -canvasInfo.yTranslate, canvasInfo.width, canvasInfo.height);
        drawCanvasContext.drawImage(imageBitmap, 0, 0);
    }

    function initializeDrawCanvas (): void {
        const context: CanvasRenderingContext2D | null = drawCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        drawCanvasContext = context;
        drawCanvasContext.imageSmoothingEnabled = false;
        drawCanvasContext.imageSmoothingQuality = "high";

        drawCanvasContext.resetTransform();
        drawCanvasContext.scale(canvasOption.zoomFactor * dpr, canvasOption.zoomFactor * dpr);
        drawCanvasContext.translate(canvasInfo.xTranslate, canvasInfo.yTranslate);
    }

    function initializeSaveCanvas (): void {
        const context: CanvasRenderingContext2D | null = saveCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        saveCanvasContext = context;
    }

    $effect((): void => {
        initializeDrawCanvas();
        initializeSaveCanvas();
        restoreDrawCanvas();
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
    onmousemove={ onMouseMove }
    oncontextmenu={ onContextMenu }>
</canvas>
<canvas
    id="save-canvas"
    width={ canvasOption.pixelSize }
    height={ canvasOption.pixelSize }
    bind:this={ saveCanvas }>
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

    #save-canvas {
        background-color: #000000;
    }
</style>