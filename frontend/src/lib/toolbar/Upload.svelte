<script lang="ts">
    import { canvasOption, offscreenCanvasInstance } from "../../structures/shared.svelte";

    let previewCanvas: HTMLCanvasElement;
    let previewCanvasContext: CanvasRenderingContext2D;
    let fileInput: HTMLInputElement;
    let file: File | null = $state(null);

    const previewCanvasSize: number = 328;

    function onInput (event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const files: FileList = target.files as FileList;
        
        file = files[0];
        fileInput.value = "";

        uploadPreviewImage();
    }

    function onDrop (event: DragEvent): void {
        event.preventDefault();

        const dataTransfer: DataTransfer = event.dataTransfer as DataTransfer;

        file = dataTransfer.files[0];

        uploadPreviewImage();
    }

    async function getImageBitmap (size: number): Promise<ImageBitmap> {
        const imageBitmap: ImageBitmap = await window.createImageBitmap(file as File, {
            resizeWidth: size,
            resizeHeight: size,
        });

        return imageBitmap;
    }

    async function uploadPreviewImage (): Promise<void> {
        const imageBitmap: ImageBitmap = await getImageBitmap(previewCanvasSize);

        previewCanvasContext.drawImage(imageBitmap, 0, 0);
    }

    async function uploadImage (): Promise<void> {
        const imageBitmap: ImageBitmap = await getImageBitmap(canvasOption.pixelSize);

        offscreenCanvasInstance.context.clearRect(0, 0, canvasOption.pixelSize, canvasOption.pixelSize);
        offscreenCanvasInstance.context.drawImage(imageBitmap, 0, 0);
    }

    function removeImage (): void {
        file = null;

        previewCanvasContext.clearRect(0, 0, previewCanvasSize, previewCanvasSize);
    }

    function initializePreviewCanvas (): void {
        previewCanvasContext = previewCanvas.getContext("2d") as CanvasRenderingContext2D;
        previewCanvasContext.imageSmoothingEnabled = false;
        previewCanvasContext.imageSmoothingQuality = "high";
    }

    $effect((): void => {
        initializePreviewCanvas();
    });
</script>

<div id="upload-container" class="container">
    <div
        id="upload-box"
        class:active={ file === null }
        class:deactive={ file !== null }>
        <p class="upload-hint">Drag and drop an image file here or</p>
        <p class="upload-hint">Please click here to upload the image file</p>
        <input
            id="file"
            type="file"
            oninput={ onInput }
            ondrop={ onDrop }
            bind:this={ fileInput }>
    </div>
    <div
        class="preview-box"
        class:active={ file !== null }
        class:deactive={ file === null }>
        <canvas
            id="preview-canvas"
            width={ previewCanvasSize }
            height={ previewCanvasSize }
            bind:this={ previewCanvas }>
        </canvas>
        <button
            class="close-button"
            onclick={ removeImage }>
            <img src="src/assets/images/close.png" alt="">
        </button>
        <button
            id="upload-button"
            onclick={ uploadImage }>
            Upload
        </button>
    </div>
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
        aspect-ratio: 1 / 1;
        border: 2px dashed #000000;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    #file {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
        opacity: 0;
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
        border: 1px solid #000000;
        aspect-ratio: 1 / 1;
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
</style>