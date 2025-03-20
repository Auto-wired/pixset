<script lang="ts">
    let previewCanvas: HTMLCanvasElement;
    let previewCanvasContext: CanvasRenderingContext2D;
    let fileInput: HTMLInputElement;
    let file: File | null = $state(null);

    function onInput (event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const files: FileList = target.files as FileList;
        
        file = files[0];
        fileInput.value = "";

        uploadImage();
    }

    function onDrop (event: DragEvent): void {
        event.preventDefault();

        const dataTransfer: DataTransfer = event.dataTransfer as DataTransfer;

        file = dataTransfer.files[0];

        uploadImage();
    }

    async function uploadImage (): Promise<void> {
        if (file === null) {
            return;
        }

        const imageBitmap = await window.createImageBitmap(file, {
            resizeWidth: 328,
            resizeHeight: 328,
        });

        previewCanvasContext.drawImage(imageBitmap, 0, 0,);
    }

    function removeImage (): void {
        file = null;
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
    <canvas
        id="preview-canvas"
        width="328"
        height="328"
        class:active={ file !== null }
        class:deactive={ file === null }
        bind:this={ previewCanvas }>
    </canvas>
</div>

<style>
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

    #preview-canvas {
        aspect-ratio: 1 / 1;
    }

    .active {
        display: flex;
    }

    .deactive {
        display: none;
    }
</style>