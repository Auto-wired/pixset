<script lang="ts">
    import BackgroundCanvas from "./BackgroundCanvas.svelte";
    import DrawCanvas from "./DrawCanvas.svelte";
    import OverlayCanvas from "./OverlayCanvas.svelte";

    import { onMount } from "svelte";

    import type { Position, CanvasInfo } from "../types";

    let canvasContainer: HTMLElement;
    let canvasInfo: CanvasInfo = $state({
        width: 0,
        height: 0,
        xStart: 0,
        yStart: 0,
        xEnd: 0,
        yEnd: 0,
    });
    let pixelSize: number = $state(32);
    let zoomFactor: number = $state(10);
    let position: Position | null = $state(null);

    function onMouseMove (event: MouseEvent): void {
        setPosition(event);
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

        setPosition(event);
    }

    function setCanvasSize (): void {
        const { width, height }: { width: number, height: number } = canvasContainer.getBoundingClientRect();

        canvasInfo.width = width;
        canvasInfo.height = height;
    }

    function setPosition (event: MouseEvent): void {
        const { offsetX, offsetY }: { offsetX: number, offsetY: number } = event;
        const xStart: number = Math.ceil(((canvasInfo.width / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor))) * zoomFactor);
        const yStart: number = Math.ceil(((canvasInfo.height / (2 * zoomFactor)) - ((pixelSize * zoomFactor) / (2 * zoomFactor))) * zoomFactor);
        const xEnd: number = Math.ceil(xStart + (pixelSize * zoomFactor)) - 1;
        const yEnd: number = Math.ceil(yStart + (pixelSize * zoomFactor)) - 1;

        canvasInfo.xStart = xStart;
        canvasInfo.yStart = yStart;
        canvasInfo.xEnd = xEnd;
        canvasInfo.yEnd = yEnd;

        if (event.type === "wheel") {
            return;
        }

        if (offsetX < xStart || offsetX > xEnd || offsetY < yStart || offsetY > yEnd) {
            position = null;

            return;
        }

        const xSpace: number = Math.floor((offsetX - xStart) / zoomFactor);
        const ySpace: number = Math.floor((offsetY - yStart) / zoomFactor);

        position = {
            x: xStart + (xSpace * zoomFactor),
            y: yStart + (ySpace * zoomFactor),
            xSpace: xSpace,
            ySpace: ySpace,
        };
    }

    // $effect((): void => {
        
    // });

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
        pixelSize={ pixelSize }
        zoomFactor={ zoomFactor }>
    </DrawCanvas>

    <OverlayCanvas
        canvasInfo={ canvasInfo }
        zoomFactor={ zoomFactor }
        position={ position }>
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