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
    let pixelSize: number = $state(17);
    let zoomFactor: number = $state(20);
    let dpr: number = $state(Math.ceil(window.devicePixelRatio));

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
        } else if (zoomFactor > 20) {
            zoomFactor = 20;
        }

        setPosition(event);
    }

    function setCanvasSize (): void {
        const { width, height }: { width: number, height: number } = canvasContainer.getBoundingClientRect();
        const parseWidth: number = Math.floor(width);
        const parseHeight: number = Math.floor(height);

        canvasContainer.style.width = `${ parseWidth }px`;
        canvasContainer.style.height = `${ parseHeight }px`;
        canvasInfo.width = parseWidth;
        canvasInfo.height = parseHeight;
        dpr = Math.ceil(window.devicePixelRatio);
    }

    function setPosition (event: MouseEvent): void {
        const { offsetX, offsetY, type }: { offsetX: number, offsetY: number, type: string } = event;
        const xStart: number = ((canvasInfo.width / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor))) * zoomFactor;
        const yStart: number = ((canvasInfo.height / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor))) * zoomFactor;
        const xEnd: number = xStart + (pixelSize * zoomFactor);
        const yEnd: number = yStart + (pixelSize * zoomFactor);

        canvasInfo.xStart = xStart;
        canvasInfo.yStart = yStart;
        canvasInfo.xEnd = xEnd;
        canvasInfo.yEnd = yEnd;

        if (type === "wheel") {
            return;
        }

        if (offsetX < xStart || offsetX > xEnd - 1 || offsetY < yStart || offsetY > yEnd - 1) {
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
        canvasInfo={ canvasInfo }
        dpr={ dpr }>
    </BackgroundCanvas>

    <DrawCanvas
        canvasInfo={ canvasInfo }
        position={ position }
        pixelSize={ pixelSize }
        zoomFactor={ zoomFactor }
        dpr={ dpr }>
    </DrawCanvas>

    <OverlayCanvas
        canvasInfo={ canvasInfo }
        position={ position }
        zoomFactor={ zoomFactor }
        dpr={ dpr }>
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