<script lang="ts">
    import type { Position } from "../../types";

    import { onMount } from "svelte";
    import { canvasInfo, canvasOption, position, offscreenCanvasInstance } from "../../structures/shared.svelte";

    let { dpr, setPosition, setTranslate }: { dpr: number, setPosition: (event: MouseEvent) => void, setTranslate: () => void } = $props();
    let drawCanvas: HTMLCanvasElement;
    let drawCanvasContext: CanvasRenderingContext2D;
    let lastPosition : Position | null = null;

    function onMouseDown (event: MouseEvent): void {
        if (event.buttons !== 1) {
            return;
        }

        setPosition(event);
        draw();

        canvasInfo.overlayCanvasVisibility = false;
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
                canvasInfo.overlayCanvasVisibility = true;

                return;
        }

        continuousAction(buttons);

        lastPosition = {
            x: position.x,
            y: position.y,
            isOutOfCanvas: position.isOutOfCanvas,
        };
    }

    function onContextMenu (event: MouseEvent): void {
        event.preventDefault();

        erase();
    }

    function draw (x: number = position.x, y: number = position.y): void {
        if (x < 0 || x >= canvasOption.width || y < 0 || y >= canvasOption.height) {
            return;
        }

        drawCanvasContext.fillStyle = canvasOption.mainColor;
        offscreenCanvasInstance.context.fillStyle = canvasOption.mainColor;

        drawCanvasContext.fillRect(x, y, 1, 1);
        offscreenCanvasInstance.context.fillRect(x, y, 1, 1);
    }

    function continuousAction (actionType: number): void {
        if (lastPosition === null) {
            return;
        }

        let x: number = lastPosition.x;
        let y: number = lastPosition.y;

        const xOffset: number = position.x - lastPosition.x;
        const yOffset: number = position.y - lastPosition.y;
        const maxSize: number = Math.abs(xOffset) > Math.abs(yOffset) ? Math.abs(xOffset) : Math.abs(yOffset);
        const xDirection: number = xOffset === 0 ? 0 : xOffset > 0 ? 1 : -1;
        const yDirection: number = yOffset === 0 ? 0 : yOffset > 0 ? 1 : -1;
        const xIncreaseOffset: number = xOffset === 0 ? 0 : maxSize / Math.abs(xOffset);
        const yIncreaseOffset: number = yOffset === 0 ? 0 : maxSize / Math.abs(yOffset);

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
        offscreenCanvasInstance.context.clearRect(x, y, 1, 1);
    }

    async function restoreDrawCanvas (): Promise<void> {
        const imageData: ImageData = offscreenCanvasInstance.context.getImageData(0, 0, canvasOption.width, canvasOption.height);
        const imageBitmap: ImageBitmap = await window.createImageBitmap(imageData, {
            resizeQuality: "pixelated",
        });

        drawCanvasContext.clearRect(-canvasInfo.xTranslate, -canvasInfo.yTranslate, canvasInfo.width, canvasInfo.height);
        drawCanvasContext.drawImage(imageBitmap, 0, 0);
    }

    function initializeDrawCanvas (): void {
        drawCanvasContext = drawCanvas.getContext("2d") as CanvasRenderingContext2D;
        drawCanvasContext.imageSmoothingEnabled = false;
        drawCanvasContext.imageSmoothingQuality = "high";

        drawCanvasContext.resetTransform();
        drawCanvasContext.scale(canvasOption.zoomFactor * dpr, canvasOption.zoomFactor * dpr);
        drawCanvasContext.translate(canvasInfo.xTranslate, canvasInfo.yTranslate);
    }

    $effect((): void => {
        initializeDrawCanvas();
        restoreDrawCanvas();
    });

    onMount((): void => {
        offscreenCanvasInstance.update = (width: number, height: number): void => {
            canvasOption.width = width;
            canvasOption.height = height;

            setTranslate();
            restoreDrawCanvas();
        };
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
    onmousedown={ onMouseDown }
    onmousemove={ onMouseMove }
    oncontextmenu={ onContextMenu }>
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