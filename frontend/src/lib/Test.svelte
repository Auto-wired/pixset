<script lang="ts">
    let firstCanvas: HTMLCanvasElement;
    let secondCanvas: HTMLCanvasElement;
    let firstContext: CanvasRenderingContext2D;
    let secondContext: CanvasRenderingContext2D;
    let firstImageData: ImageData;
    let secondImageData: ImageData;
    let canvasSize: number = 300;

    const dpr: number = 2;

    function drawFirst (): void {
        const colorList: Array<string> = [
            "#000000",
            "#990000",
            "#ff0000",
            "#ff9900",
            "#ffff00",
            "#ffff99",
            "#ffffff",
            "#009900",
            "#00ff00",
            "#00ff99",
            "#00ffff",
            "#000099",
            "#0000ff",
        ];

        for (let i: number = 0; i < colorList.length; i++) {
            firstContext.fillStyle = colorList[i];

            for (let j: number = 0; j < colorList.length; j++) {
                firstContext.fillRect(i * 50, j * 50, 50, 50);
            }
        }
    }

    function saveFirst (): void {
        firstImageData = firstContext.getImageData(0, 0, 600, 600);

        console.log(firstImageData);
    }

    function pasteSecond (): void {
        let ibm: ImageBitmap;
        
        window.createImageBitmap(firstImageData, {
            resizeWidth: 600,
            resizeHeight: 600,
        }).then((result: ImageBitmap) => {
            ibm = result;

            secondContext.drawImage(ibm, 0, 0);
            // secondContext.putImageData(firstImageData, 0, 0);
        });
    }

    function setFirstContext (): void {
        const context: CanvasRenderingContext2D | null = firstCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        firstContext = context;
        // firstContext.translate(100, 100);
    }

    function setSecondContext (): void {
        const context: CanvasRenderingContext2D | null = secondCanvas.getContext("2d");

        if (context === null) {
            return;
        }

        secondContext = context;
        secondContext.scale(dpr, dpr);
        secondContext.translate(100, 100);
    }

    $effect((): void => {
        setFirstContext();
        setSecondContext();
        drawFirst();
        saveFirst();
        pasteSecond();
    });
</script>

<canvas
    width={ canvasSize * 2 }
    height={ canvasSize * 2 }
    bind:this={ firstCanvas }>
</canvas>
<canvas
    width={ canvasSize * dpr }
    height={ canvasSize * dpr }
    bind:this={ secondCanvas }>
</canvas>

<style>
    canvas {
        width: 300px;
        height: 300px;
        margin: 4px;
        border: 1px solid #000000;
    }
</style>