<script lang="ts">
    import BackgroundCanvas from "./BackgroundCanvas.svelte";
    import DrawCanvas from "./DrawCanvas.svelte";
    import OverlayCanvas from "./OverlayCanvas.svelte";

    import { onMount } from "svelte";

    import type { CanvasInfo, Position } from "../types";

    let canvasContainer: HTMLElement;
    let canvasInfo: CanvasInfo = $state({
        width: 0,
        height: 0,
        xStart: 0,
        yStart: 0,
        xEnd: 0,
        yEnd: 0,
    });
    let position: Position = $state({
        x: 0,
        y: 0,
        xSpace: 0,
        ySpace: 0,
        isOutOfCanvas: true,
    });
    let pixelSize: number = $state(32);
    let zoomFactor: number = $state(10);

    function onMouseMove (event: MouseEvent): void {
        setPosition(event);
    }

    function onWheel (event: WheelEvent): void {
        const { deltaY }: { deltaY: number } = event;

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

        setPosition(event);
    }

    function setCanvasSize (): void {
        const { width, height }: { width: number, height: number } = canvasContainer.getBoundingClientRect();

        canvasInfo.width = width;
        canvasInfo.height = height;
    }

    function setPosition (event: MouseEvent): void {
        const { offsetX, offsetY, type }: { offsetX: number, offsetY: number, type: string } = event;
        const xStart: number = Math.ceil(((canvasInfo.width / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor))) * zoomFactor);
        const yStart: number = Math.ceil(((canvasInfo.height / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor))) * zoomFactor);
        const xEnd: number = Math.ceil(xStart + (pixelSize * zoomFactor)) - 1;
        const yEnd: number = Math.ceil(yStart + (pixelSize * zoomFactor)) - 1;

        canvasInfo.xStart = xStart;
        canvasInfo.yStart = yStart;
        canvasInfo.xEnd = xEnd;
        canvasInfo.yEnd = yEnd;

        if (type === "wheel") {
            return;
        }

        if (offsetX < xStart || offsetX > xEnd || offsetY < yStart || offsetY > yEnd) {
            position.isOutOfCanvas = true;

            return;
        }

        const xSpace: number = Math.floor((offsetX - xStart) / zoomFactor);
        const ySpace: number = Math.floor((offsetY - yStart) / zoomFactor);

        position.x = xStart + (xSpace * zoomFactor);
        position.y = yStart + (ySpace * zoomFactor);
        position.xSpace = xSpace;
        position.ySpace = ySpace;
        position.isOutOfCanvas = false;
    }

    onMount((): void => {
        setCanvasSize();
    });

    window.addEventListener("resize", (): void => {
        setCanvasSize();
    });
</script>

<div
    id="canvas-container"
    role="region"
    bind:this={ canvasContainer }
    onmousemove={ onMouseMove }
    onwheel={ onWheel }>

    <BackgroundCanvas
        canvasInfo={ canvasInfo }>
    </BackgroundCanvas>

    <DrawCanvas
        canvasInfo={ canvasInfo }
        position={ position }
        pixelSize={ pixelSize }
        zoomFactor={ zoomFactor }>
    </DrawCanvas>

    <OverlayCanvas
        canvasInfo={ canvasInfo }
        position={ position }
        zoomFactor={ zoomFactor }>
    </OverlayCanvas>
    
</div>

<style>
    #canvas-container {
        width: 70%;
        height: 95%;
        position: relative;
        background-color: #ffffff;
    }
</style>