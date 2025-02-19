<script lang="ts">
    import Modal from "../Modal.svelte";

    import { canvasInfo, modal } from "../../structures/shared.svelte";

    let isDownload: boolean = $state(true);
    let imageName: string = $state("");
    let imageWidth: number = $state(32);
    let imageHeight: number = $state(32);
    let isSameSize: boolean = $state(true);
    let imageType: string = $state("png");

    modal.title = "Download / Upload Image";

    function downloadImage (): void {
        const downloadDOM: HTMLAnchorElement = document.createElement("a");

        downloadDOM.download = `${ imageName }.${ imageType }`;
        downloadDOM.href = canvasInfo.imageDataUrl;

        downloadDOM.click();
        downloadDOM.remove();
    }

    function syncSize (): void {
        if (isSameSize) {
            imageHeight = imageWidth;
        }
    }

    $effect((): void => {
        syncSize();
    });
</script>

<div id="save-image">
    <button onclick={ modal.open }>save</button>
    <Modal modal={ modal }>
        <div id="save-image-modal">
            <div class="menu">
                <button id="download-menu-button" class="active">Download</button>
                <button id="upload-menu-button" class="deactive">Upload</button>
            </div>
            <div class="container">
                <div class="content">
                    <p class="title">Name</p>
                    <input
                        class="name-input"
                        type="text"
                        placeholder="Name"
                        bind:value={ imageName }>
                </div>
                <div class="content">
                    <p class="title">Size</p>
                    <input
                        class="size-input"
                        type="number"
                        bind:value={ imageWidth }>
                    <p style="margin: 0 8px;">X</p>
                    <input
                        class="size-input"
                        type="number"
                        disabled={ isSameSize }
                        bind:value={ imageHeight }>
                </div>
                <div class="content">
                    <label class="same-size-label">
                        <input
                            type="checkbox"
                            bind:checked={ isSameSize }>
                        Maintain aspect ratio
                    </label>
                </div>
                <button
                    id="download-button"
                    onclick={ downloadImage }>
                    Download
                </button>
            </div>
        </div>
    </Modal>
</div>

<style>
    input {
        height: 30px;
        border: 1px solid #000000;
    }

    #save-image-modal {
        width: 320px;
        display: flex;
        flex-direction: column;
    }

    .menu {
        width: 100%;
        display: flex;
    }

    .menu > button {
        width: 100%;
        height: 30px;
        border: none;
    }

    .active {
        color: #000000;
        background-color: #FFFFFF;
    }

    .deactive {
        color: #FFFFFF;
        background-color: #000000;
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
        align-items: center;
    }

    .title {
        width: 60px;
    }

    .name-input {
        width: calc(100% - 60px);
    }

    .size-input {
        width: calc(50% - 44px);
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
        color: #FFFFFF;
        background-color: #000000;
    }
</style>