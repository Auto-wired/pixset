<script lang="ts">
    import BackgroundCanvas from "./BackgroundCanvas.svelte";
    import DrawCanvas from "./DrawCanvas.svelte";
    import OverlayCanvas from "./OverlayCanvas.svelte";

    import { onMount } from "svelte";
    import { canvasInfo, canvasOption, position } from "../structures/shared.svelte";

    let canvasContainer: HTMLElement;
    let dpr: number = $state(Math.ceil(window.devicePixelRatio));

    function onMouseMove (event: MouseEvent): void {
        setPosition(event);
    }

    function onWheel (event: WheelEvent): void {
        const { deltaY }: { deltaY: number } = event;

        if (deltaY < 0) {
            canvasOption.zoomFactor += 1;
        } else {
            canvasOption.zoomFactor -= 1;
        }

        if (canvasOption.zoomFactor < 1) {
            canvasOption.zoomFactor = 1;
        } else if (canvasOption.zoomFactor > 20) {
            canvasOption.zoomFactor = 20;
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
        const xStart: number = canvasInfo.xTranslate * canvasOption.zoomFactor;
        const yStart: number = canvasInfo.yTranslate * canvasOption.zoomFactor;
        const xEnd: number = xStart + (canvasOption.pixelSize * canvasOption.zoomFactor);
        const yEnd: number = yStart + (canvasOption.pixelSize * canvasOption.zoomFactor);

        canvasInfo.xStart = xStart;
        canvasInfo.yStart = yStart;
        canvasInfo.xEnd = xEnd;
        canvasInfo.yEnd = yEnd;

        if (type === "wheel") {
            return;
        }

        // position.x = xStart + (xSpace * canvasOption.zoomFactor);
        // position.y = yStart + (ySpace * canvasOption.zoomFactor);
        position.x = Math.floor((offsetX - xStart) / canvasOption.zoomFactor);
        position.y = Math.floor((offsetY - yStart) / canvasOption.zoomFactor);
        position.isOutOfCanvas = offsetX < xStart || offsetX > xEnd - 1 || offsetY < yStart || offsetY > yEnd - 1;
    }

    function setTranslate (): void {
        const xTranslate: number = (canvasInfo.width / (2 * canvasOption.zoomFactor)) - ((canvasOption.pixelSize * canvasOption.zoomFactor) / (2 * canvasOption.zoomFactor));
        const yTranslate: number = (canvasInfo.height / (2 * canvasOption.zoomFactor)) - ((canvasOption.pixelSize * canvasOption.zoomFactor) / (2 * canvasOption.zoomFactor));

        canvasInfo.xTranslate = xTranslate;
        canvasInfo.yTranslate = yTranslate;
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
        canvasOption={ canvasOption }
        dpr={ dpr }>
    </BackgroundCanvas>

    <DrawCanvas
        canvasInfo={ canvasInfo }
        canvasOption={ canvasOption }
        position={ position }
        dpr={ dpr }
        setPosition={(event: MouseEvent) => {
            setPosition(event);
        }}>
    </DrawCanvas>

    <OverlayCanvas
        canvasInfo={ canvasInfo }
        canvasOption={ canvasOption }
        position={ position }
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