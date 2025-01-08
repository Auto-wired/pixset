<script lang="ts">
    type Position = {
        x: number;
        y: number;
    };

    const dpr: number = window.devicePixelRatio;

    let mainCanvas: HTMLCanvasElement;
    let backgroundCanvas: HTMLCanvasElement;
    let mainCanvasContext: CanvasRenderingContext2D;
    let pixelSize: number = $state(16);
    let canvasSize: number = $derived(400);
    let divisionValue: number = $derived(canvasSize / pixelSize);
    let mainColor: string = $state("#ffffff");
    let lastPosition: Position | null = null;

    function drawBackground (): void {
        const context: CanvasRenderingContext2D | null = backgroundCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        const backgroundCanvasContext: CanvasRenderingContext2D = context;
        const evenColor: string = "#aaaaaa";
        const oddColor: string = "#777777";

        backgroundCanvasContext.scale(dpr, dpr);

        for (let i: number = 0; i < pixelSize; i++) {
            if (i % 2 === 0) {
                backgroundCanvasContext.fillStyle = evenColor;
            } else {
                backgroundCanvasContext.fillStyle = oddColor;
            }

            for (let j: number = 0; j < pixelSize; j++) {
                const fillStyle: string = backgroundCanvasContext.fillStyle;

                backgroundCanvasContext.fillStyle = fillStyle === evenColor ? oddColor : evenColor;

                backgroundCanvasContext.fillRect(i * divisionValue, j * divisionValue, divisionValue, divisionValue);
            }
        }
    }

    function onClickCanvas (event: MouseEvent): void {
        const position: Position = getPosition(event);

        draw(position.x, position.y);
    }

    function onContextMenuCanvas (event: MouseEvent): void {
        event.preventDefault();

        const position: Position = getPosition(event);

        erase(position.x, position.y);
    }

    function onMouseMoveCanvas (event: MouseEvent): void {
        if (event.buttons === 1) {
            const currentPosition: Position = getPosition(event);

            draw(currentPosition.x, currentPosition.y);
            continuousDraw(currentPosition);

            lastPosition = currentPosition;
        } else if (event.buttons === 2) {

        }
    }

    function continuousDraw (currentPosition: Position): void {
        if (lastPosition === null) {
            return;
        }

        const xOffset: number = currentPosition.x - lastPosition.x;
        const yOffset: number = currentPosition.y - lastPosition.y;
        const maxSize: number = Math.abs(xOffset) > Math.abs(yOffset) ? Math.abs(xOffset) : Math.abs(yOffset);
        const xDirection: number = xOffset === 0 ? 0 : xOffset > 0 ? 1 : -1;
        const yDirection: number = yOffset === 0 ? 0 : yOffset > 0 ? 1 : -1;
        const xIncreaseOffset: number = xOffset === 0 ? 0 : maxSize / Math.abs(xOffset);
        const yIncreaseOffset: number = yOffset === 0 ? 0 : maxSize / Math.abs(yOffset);

        let x: number = lastPosition.x;
        let y: number = lastPosition.y;

        for (let i: number = 1; i < maxSize; i++) {
            if (i % xIncreaseOffset < 1) {
                x += xDirection;
            }

            if (i % yIncreaseOffset < 1) {
                y += yDirection;
            }

            draw(x, y);
        }
    }

    function draw (x: number, y: number): void {
        mainCanvasContext.fillStyle = mainColor;

        mainCanvasContext.fillRect(x * divisionValue, y * divisionValue, divisionValue, divisionValue);

        console.log(x * divisionValue, y * divisionValue, divisionValue, divisionValue);
    }

    function erase (x: number, y: number): void {
        mainCanvasContext.clearRect(x * divisionValue, y * divisionValue, divisionValue, divisionValue);
    }

    function getPosition (event: MouseEvent): Position {
        const { offsetX, offsetY } = event;
        const position: Position = {
            x: Math.floor(offsetX / divisionValue),
            y: Math.floor(offsetY / divisionValue),
        };

        return position;
    }

    $effect((): void => {
        const context: CanvasRenderingContext2D | null = mainCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        mainCanvasContext = context;
        mainCanvasContext.scale(dpr, dpr);

        drawBackground();
    });
</script>

<div id="canvas-container">
    <canvas
        id="main-canvas"
        bind:this={ mainCanvas }
        onclick={ onClickCanvas }
        oncontextmenu={ onContextMenuCanvas }
        onmousemove={ onMouseMoveCanvas }
        onmouseup={ () => lastPosition = null }
        onmouseleave={ () => lastPosition = null }
        width={ canvasSize * dpr }
        height={ canvasSize * dpr }
    >
    </canvas>
    <canvas
        id="background-canvas"
        bind:this={ backgroundCanvas }
        width={ canvasSize * dpr }
        height={ canvasSize * dpr }
    >
    </canvas>
</div>

<style>
    #canvas-container {
        width: 500px;
        height: 500px;
        position: relative;
    }

    #main-canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

    #background-canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>