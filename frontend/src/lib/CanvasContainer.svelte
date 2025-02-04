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
        x: -1,
        y: -1,
        xTranslate: -1,
        yTranslate: -1,
        isOutOfCanvas: true,
    });
    let pixelSize: number = $state(100);
    let zoomFactor: number = $state(1);
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
        setTranslate();

        const { offsetX, offsetY, type }: { offsetX: number, offsetY: number, type: string } = event;
        const xStart: number = position.xTranslate * zoomFactor;
        const yStart: number = position.yTranslate * zoomFactor;
        const xEnd: number = xStart + (pixelSize * zoomFactor);
        const yEnd: number = yStart + (pixelSize * zoomFactor);

        canvasInfo.xStart = xStart;
        canvasInfo.yStart = yStart;
        canvasInfo.xEnd = xEnd;
        canvasInfo.yEnd = yEnd;

        if (type === "wheel") {
            return;
        }

        // position.x = xStart + (xSpace * zoomFactor);
        // position.y = yStart + (ySpace * zoomFactor);
        position.x = Math.floor((offsetX - xStart) / zoomFactor);
        position.y = Math.floor((offsetY - yStart) / zoomFactor);
        position.isOutOfCanvas = offsetX < xStart || offsetX > xEnd - 1 || offsetY < yStart || offsetY > yEnd - 1;
    }

    function setTranslate (): void {
        const xTranslate: number = (canvasInfo.width / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor));
        const yTranslate: number = (canvasInfo.height / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor));

        position.xTranslate = xTranslate;
        position.yTranslate = yTranslate;
    }

    onMount((): void => {
        setCanvasSize();
        setTranslate();
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
        position={ position }
        pixelSize={ pixelSize }
        zoomFactor={ zoomFactor }
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