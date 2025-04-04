<script lang="ts">
    import BackgroundCanvas from "./BackgroundCanvas.svelte";
    import DrawCanvas from "./DrawCanvas.svelte";
    import OverlayCanvas from "./OverlayCanvas.svelte";

    import { onMount } from "svelte";
    import { canvasInfo, canvasOption, position, offscreenCanvasInstance } from "../../structures/shared.svelte";

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
        const parseWidth: number = Math.floor(window.innerWidth * 0.7);
        const parseHeight: number = Math.floor(window.innerHeight * 0.95);

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
        const xEnd: number = xStart + (canvasOption.width * canvasOption.zoomFactor);
        const yEnd: number = yStart + (canvasOption.height * canvasOption.zoomFactor);

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
        const xTranslate: number = (canvasInfo.width / (2 * canvasOption.zoomFactor)) - ((canvasOption.width * canvasOption.zoomFactor) / (2 * canvasOption.zoomFactor));
        const yTranslate: number = (canvasInfo.height / (2 * canvasOption.zoomFactor)) - ((canvasOption.height * canvasOption.zoomFactor) / (2 * canvasOption.zoomFactor));

        canvasInfo.xTranslate = xTranslate;
        canvasInfo.yTranslate = yTranslate;
    }

    function initializeOffscreenCanvas (): void {
        offscreenCanvasInstance.context = offscreenCanvasInstance.canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        offscreenCanvasInstance.canvas.width = canvasOption.width;
        offscreenCanvasInstance.canvas.height = canvasOption.height;
    }

    onMount((): void => {
        setCanvasSize();
        setTranslate();
        initializeOffscreenCanvas();
    });

    window.addEventListener("resize", (): void => {
        setCanvasSize();
        setTranslate();
    });
</script>

<div
    id="canvas-container"
    role="region"
    bind:this={ canvasContainer }
    onmousemove={ onMouseMove }
    onwheel={ onWheel }>

    <BackgroundCanvas dpr={ dpr }></BackgroundCanvas>

    <DrawCanvas
        dpr={ dpr }
        setPosition={(event: MouseEvent): void => {
            setPosition(event);
        }}
        setTranslate={(): void => {
            setTranslate();
        }}>
    </DrawCanvas>
    
    <OverlayCanvas dpr={ dpr }></OverlayCanvas>
    
</div>

<style>
    #canvas-container {
        position: relative;
        background-color: #ffffff;
    }
</style>