<script lang="ts">
    import type { Size } from "../../types";

    import { onMount } from "svelte";
    import { offscreenCanvasInstance, modal } from "../../structures/shared.svelte";

    let previewCanvas: HTMLCanvasElement;
    let previewCanvasContext: CanvasRenderingContext2D;
    let fileInput: HTMLInputElement;
    let file: File | null = $state(null);
    let imageSize: Size = $state({
        width: 0,
        height: 0,
    });
    let imageQuality: number = $state(100);
    let resizeImageBitmap: ImageBitmap | null = $state(null);

    function onInput (event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const files: FileList = target.files as FileList;

        file = files[0];
        fileInput.value = "";

        drawPreviewImage();
    }

    function onDrop (event: DragEvent): void {
        event.preventDefault();

        const dataTransfer: DataTransfer = event.dataTransfer as DataTransfer;

        file = dataTransfer.files[0];

        drawPreviewImage();
    }

    function onDragover (event: DragEvent): void {
        event.preventDefault();
    }

    function validateFile (): boolean {
        if (!/image\/(png|jpeg|webp)/.test(file!.type)) {
            alert("file type!");

            file = null;

            return false;
        }

        return true;
    }

    async function getImageBitmap (width: number | undefined, height: number | undefined): Promise<ImageBitmap> {
        const imageBitmap: ImageBitmap = await window.createImageBitmap(file as File, {
            resizeWidth: width,
            resizeHeight: height,
            resizeQuality: "pixelated",
        });

        return imageBitmap;
    }

    async function drawPreviewImage (): Promise<void> {
        if (file === null || !validateFile()) {
            return;
        }

        const imageWidth: number | undefined = imageSize.width !== 0 ? imageSize.width : undefined;
        const imageHeight: number | undefined = imageSize.height !== 0 ? imageSize.height : undefined;
        const ratio: number = imageQuality / 100;
        const imageBitmap: ImageBitmap = await getImageBitmap(imageWidth, imageHeight);
        const { width, height }: { width: number, height: number } = previewCanvas.getBoundingClientRect();
        const scale: number = Math.min(width / imageSize.width, height / imageSize.height);

        resizeImageBitmap = await window.createImageBitmap(
            await getImageBitmap(imageBitmap.width * ratio, imageBitmap.height * ratio),
            {
                resizeWidth: imageBitmap.width,
                resizeHeight: imageBitmap.height,
                resizeQuality: "pixelated",
            }
        );

        if (imageSize.width === 0) {
            imageSize.width = imageBitmap.width;
        }
        
        if (imageSize.height === 0) {
            imageSize.height = imageBitmap.height;
        }

        previewCanvasContext.resetTransform();
        previewCanvasContext.clearRect(0, 0, width, height);
        previewCanvasContext.translate((width - (imageBitmap.width * scale)) / 2, (height - (imageBitmap.height * scale)) / 2);
        previewCanvasContext.scale(scale, scale);
        previewCanvasContext.drawImage(resizeImageBitmap, 0, 0);
    }

    async function uploadImage (): Promise<void> {
        offscreenCanvasInstance.canvas.width = imageSize.width;
        offscreenCanvasInstance.canvas.height = imageSize.height;

        offscreenCanvasInstance.context.clearRect(0, 0, imageSize.width, imageSize.height);
        offscreenCanvasInstance.context.drawImage(resizeImageBitmap as ImageBitmap, 0, 0);
        offscreenCanvasInstance.update(imageSize.width, imageSize.height);
        modal.close();
    }

    function removeImage (): void {
        file = null;
        resizeImageBitmap = null;
        imageSize.width = 0;
        imageSize.height = 0;
        imageQuality = 100;

        previewCanvasContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    }

    function initializePreviewCanvas (): void {
        previewCanvasContext = previewCanvas.getContext("2d") as CanvasRenderingContext2D;
        previewCanvasContext.imageSmoothingEnabled = false;
        previewCanvasContext.imageSmoothingQuality = "high";
    }

    $effect((): void => {
        if (imageSize.width === null || (imageSize.width < 1 && resizeImageBitmap !== null)) {
            imageSize.width = 1;
        }

        if (imageSize.height === null || (imageSize.height < 1 && resizeImageBitmap !== null)) {
            imageSize.height = 1;
        }

        drawPreviewImage();
    });

    onMount((): void => {
        initializePreviewCanvas();
    });
</script>

<div id="upload-container" class="container">

    <!-- upload box -->
    <div
        id="upload-box"
        class:active={ file === null }
        class:deactive={ file !== null }>
        <p class="upload-hint">Drag and drop an image file here or</p>
        <p class="upload-hint">Please click here to upload the image file</p>
        <label
            id="file-label"
            ondrop={ onDrop }
            ondragover={ onDragover }>
            <input
                id="file"
                type="file"
                bind:this={ fileInput }
                oninput={ onInput }>
        </label>
    </div>
    <!-- upload box -->

    <!-- preview box -->
    <div
        class="preview-box"
        class:active={ file !== null }
        class:deactive={ file === null }>

        <!-- preview canvas -->
        <canvas
            id="preview-canvas"
            width={ 328 }
            height={ 200 }
            bind:this={ previewCanvas }>
        </canvas>
        <!-- preview canvas -->

        <!-- image size -->
        <div class="content">
            <p class="title">Size</p>
            <input
                class="size-input"
                type="number"
                bind:value={ imageSize.width }>
            <p style="margin: 0 8px;">X</p>
            <input
                class="size-input"
                type="number"
                bind:value={ imageSize.height }>
        </div>
        <!-- image size -->

        <!-- image quality -->
        <div class="content">
            <p class="title">Quality</p>
            <div class="quality-box">
                <input
                    id="quality"
                    type="range"
                    min="1"
                    max="100"
                    bind:value={ imageQuality }>
                <p style:left={ `calc(${ imageQuality }% + ${ 10 - imageQuality * 0.21 }px)` }>{ imageQuality }</p>
            </div>
        </div>
        <!-- image quality -->
        
        <!-- remove button -->
        <button
            class="close-button"
            onclick={ removeImage }>
            <img src="src/assets/images/close.png" alt="">
        </button>
        <!-- remove button -->

        <!-- upload button -->
        <button
            id="upload-button"
            onclick={ uploadImage }>
            Upload
        </button>
        <!-- upload button -->

    </div>
    <!-- preview box -->

</div>

<style>
    #upload-container {
        position: relative;
    }

    .container {
        width: 100%;
        padding: 16px;
        display: flex;
        flex-direction: column;
    }

    #upload-box {
        width: 100%;
        height: 200px;
        border: 2px dashed #000000;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    #file {
        visibility: hidden;
    }

    #file-label {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
    }

    .upload-hint {
        font-size: 14px;
    }

    .preview-box {
        display: flex;
        flex-direction: column;
    }

    #preview-canvas {
        width: 100%;
        height: 200px;
        border: 1px solid #000000;
    }

    .active {
        display: flex;
    }

    .deactive {
        display: none;
    }

    .close-button {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        border: none;
        position: absolute;
        top: 20px;
        right: 20px;
        color: #FFFFFF;
        background-color: #000000;
    }

    .close-button > img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    #upload-button {
        height: 40px;
        margin-top: 20px;
        border: none;
        border-radius: 4px;
        color: #FFFFFF;
        background-color: #000000;
    }

    .content {
        width: 100%;
        margin: 4px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title {
        width: 60px;
    }

    .size-input {
        width: calc(50% - 50px);
        height: 30px;
        padding: 8px;
        border: 1px solid #000000;
        border-radius: 4px;
    }

    .quality-box {
        width: calc(100% - 64px);
        height: 10px;
        position: relative;
    }

    #quality {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #000000;
        appearance: none;
    }

    #quality::-webkit-slider-thumb {
        width: 24px;
        height: 24px;
        border: 1px solid #000000;
        border-radius: 100%;
        cursor: pointer;
        background-color: #FFFFFF;
        appearance: none;
    }

    .quality-box > p {
        font-size: 10px;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        color: #000000;
    }
</style>