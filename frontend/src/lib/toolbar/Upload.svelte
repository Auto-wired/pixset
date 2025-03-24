<script lang="ts">
    import { offscreenCanvasInstance, modal } from "../../structures/shared.svelte";

    let previewCanvas: HTMLCanvasElement;
    let previewCanvasContext: CanvasRenderingContext2D;
    let fileInput: HTMLInputElement;
    let file: File | null = $state(null);

    const previewCanvasSize: number = 328;

    interface PreviewSize {
        width: number;
        height: number;
        resizeWidth: number;
        resizeHeight: number;
    };

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

    function validateFile (): boolean {
        if (!/image\/(png|jpeg|webp)/.test(file!.type)) {
            alert("file type!");

            file = null;

            return false;
        }

        return true;
    }

    async function getImageBitmap (width: number, height: number): Promise<ImageBitmap> {
        const imageBitmap: ImageBitmap = await window.createImageBitmap(file as File, {
            resizeWidth: width,
            resizeHeight: height,
        });

        return imageBitmap;
    }

    async function getPreviewSize (): Promise<PreviewSize> {
        const image: HTMLImageElement = new Image();

        image.src = window.URL.createObjectURL(file as File);

        return new Promise<PreviewSize>((resolve: (value: PreviewSize) => void) => {
            image.onload = (): void => {
                const ratio: number = Math.floor((image.width > image.height ? image.width : image.height) / previewCanvasSize);

                resolve({
                    width: image.width,
                    height: image.height,
                    resizeWidth: Math.floor(image.width / ratio),
                    resizeHeight: Math.floor(image.height / ratio),
                });
            }
        });
    }

    async function uploadPreviewImage (): Promise<void> {
        if (!validateFile()) {
            return;
        }

        const { resizeWidth, resizeHeight }: PreviewSize = await getPreviewSize();
        const imageBitmap: ImageBitmap = await getImageBitmap(resizeWidth, resizeHeight);

        previewCanvasContext.drawImage(imageBitmap, previewCanvas.width / 2 - resizeWidth / 2, previewCanvas.height / 2 - resizeHeight / 2);
    }

    async function uploadImage (): Promise<void> {
        const { width, height }: PreviewSize = await getPreviewSize();
        const imageBitmap: ImageBitmap = await getImageBitmap(width, height);

        offscreenCanvasInstance.canvas.width = width;
        offscreenCanvasInstance.canvas.height = height;

        offscreenCanvasInstance.context.clearRect(0, 0, width, height);
        offscreenCanvasInstance.context.drawImage(imageBitmap, 0, 0);
        offscreenCanvasInstance.update(width, height);
        modal.close();
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
        aspect-ratio: 1 / 1;
        background-color: #000000;
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