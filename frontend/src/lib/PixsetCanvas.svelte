<script lang="ts">
    type Position = {
        x: number;
        y: number;
    };

    let mainCanvas: HTMLCanvasElement;
    let backgroundCanvas: HTMLCanvasElement;
    let mainCanvasContext: CanvasRenderingContext2D;
    let canvasSize: number = $state(100);
    let mainColor: string = $state("#ffffff");
    let lastPosition: Position | null = null;

    const dpr: number = window.devicePixelRatio;
    const divisionValue: number = $derived(500 / canvasSize);

    function drawBackground (): void {
        const context: CanvasRenderingContext2D | null = backgroundCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        const backgroundCanvasContext: CanvasRenderingContext2D = context;
        const evenColor: string = "#aaaaaa";
        const oddColor: string = "#777777";

        for (let i: number = 0; i < canvasSize; i++) {
            if (i % 2 === 0) {
                backgroundCanvasContext.fillStyle = evenColor;
            } else {
                backgroundCanvasContext.fillStyle = oddColor;
            }

            for (let j: number = 0; j < canvasSize; j++) {
                const fillStyle: string = backgroundCanvasContext.fillStyle;

                backgroundCanvasContext.fillStyle = fillStyle === evenColor ? oddColor : evenColor;

                backgroundCanvasContext.fillRect(i * divisionValue, j * divisionValue, divisionValue, divisionValue);
            }
        }

        backgroundCanvasContext.scale(dpr, dpr);
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

        drawBackground();
    });
</script>

<div id="canvas-container">
    <canvas
        id="main-canvas"
        width={ 500 * dpr }
        height={ 500 * dpr }
        bind:this={ mainCanvas }
        onclick={ onClickCanvas }
        oncontextmenu={ onContextMenuCanvas }
        onmousemove={ onMouseMoveCanvas }
        onmouseup={ () => lastPosition = null }
        onmouseleave={ () => lastPosition = null }
    >
    </canvas>
    <canvas
        id="background-canvas"
        width={ 500 * dpr }
        height={ 500 * dpr }
        bind:this={ backgroundCanvas }
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