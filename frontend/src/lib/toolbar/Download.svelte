<script lang="ts">
    import type { Size } from "../../types";

    import { canvasOption, offscreenCanvasInstance } from "../../structures/shared.svelte";

    let imageName: string = $state("");
    let imageSize: Size = $state({
        width: canvasOption.width,
        height: canvasOption.height,
    });
    let isSameSize: boolean = $state(true);
    let imageType: string = $state("png");

    const imageTypeList: Array<string> = [
        "png",
        "jpg",
        "webp",
    ];

    async function downloadImage (): Promise<void> {
        if (!validateDownload()) {
            return;
        }

        const offscreenCanvas: OffscreenCanvas = new OffscreenCanvas(imageSize.width, imageSize.height);
        const offscreenCanvasContext: OffscreenCanvasRenderingContext2D = offscreenCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        const imageData: ImageData = offscreenCanvasInstance.context.getImageData(0, 0, canvasOption.width, canvasOption.height);
        const imageBitmap: ImageBitmap = await window.createImageBitmap(imageData);
        const link: HTMLAnchorElement = document.createElement("a");

        offscreenCanvasContext.imageSmoothingEnabled = false;
        offscreenCanvasContext.imageSmoothingQuality = "high";

        offscreenCanvasContext.scale(imageSize.width / canvasOption.width, imageSize.height / canvasOption.height);
        offscreenCanvasContext.drawImage(imageBitmap, 0, 0);

        const blob: Blob = await offscreenCanvas.convertToBlob({
            type: `image/${ imageType }`,
        });
        const url: string = window.URL.createObjectURL(blob);

        link.download = `${ imageName }.${ imageType }`;
        link.href = url;

        link.click();
        link.remove();
    }

    function syncSize (): void {
        if (isSameSize) {
            imageSize.height = imageSize.width;
        }
    }

    function validateDownload (): boolean {
        if (imageName.length === 0) {
            alert("name!");

            return false;
        }

        return true;
    }

    $effect((): void => {
        syncSize();
    });
</script>

<div id="download-container" class="container">

    <!-- image name -->
    <div class="content">
        <p class="title">Name</p>
        <input
            class="name-input"
            type="text"
            placeholder="Name"
            bind:value={ imageName }>
    </div>
    <!-- image name -->

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
            disabled={ isSameSize }
            bind:value={ imageSize.height }>
    </div>
    <!-- image size -->

    <!-- same size -->
    <div class="content">
        <label class="same-size-label">
            <input
                type="checkbox"
                bind:checked={ isSameSize }>
            Maintain aspect ratio
        </label>
    </div>
    <!-- same size -->

    <!-- image type -->
    <div class="content">
        {#each imageTypeList as imageTypeItem}
            <button
                class="image-type-button"
                class:active={ imageType === imageTypeItem }
                class:deactive={ imageType !== imageTypeItem }
                onclick={(): void => {
                    imageType = imageTypeItem;
                }}>
                { imageTypeItem }
            </button>
        {/each}
    </div>
    <!-- image type -->

    <!-- image download -->
    <button
        id="download-button"
        onclick={ downloadImage }>
        Download
    </button>
    <!-- image download -->

</div>

<style>
    input {
        height: 30px;
        padding: 8px;
        border: 1px solid #000000;
        border-radius: 4px;
    }

    .container {
        width: 100%;
        padding: 16px;
        display: flex;
        flex-direction: column;
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

    .name-input {
        width: calc(100% - 64px);
    }

    .size-input {
        width: calc(50% - 50px);
    }

    .same-size-label {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    #download-button {
        height: 40px;
        margin-top: 20px;
        border: none;
        border-radius: 4px;
        color: #FFFFFF;
        background-color: #000000;
    }

    .image-type-button {
        width: calc((100% / 3) - 3px);
        height: 28px;
        border: 1px solid #000000;
        border-radius: 4px;
    }

    .active {
        pointer-events: none;
        color: #000000;
        background-color: #FFFFFF;
    }

    .deactive {
        color: #FFFFFF;
        background-color: #000000;
    }
</style>