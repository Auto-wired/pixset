<script lang="ts">
    import Modal from "../Modal.svelte";

    import { canvasInfo, modal } from "../../structures/shared.svelte";

    let isDownload: boolean = $state(true);

    function downloadImage (): void {
        const downloadDOM: HTMLAnchorElement = document.createElement("a");

        downloadDOM.download = "test.png";
        downloadDOM.href = canvasInfo.imageDataUrl;

        downloadDOM.click();
        downloadDOM.remove();
    }

    modal.title = "Download / Upload Image";
</script>

<div id="save-image">
    <button onclick={ modal.open }>save</button>
    <Modal modal={ modal }>
        <div class="menu">
            <button id="download-menu-button" class="active">Download</button>
            <button id="upload-menu-button" class="deactive">Upload</button>
        </div>
        <div class="container">
            <div class="content">
                <p>Name</p>
                <input class="name-input" type="text" placeholder="Name">
            </div>
            <div class="content">
                <p>Size</p>
                <input class="size-input" type="text">
                <p>X</p>
                <input class="size-input" type="text">
            </div>
            <button id="download-button">Download</button>
        </div>
    </Modal>
</div>

<style>
    input {
        height: 30px;
        border: 1px solid #000000;
    }

    .menu {
        display: flex;
    }

    .menu > button {
        width: 200px;
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
        padding: 8px;
        display: flex;
        flex-direction: column;
    }

    .content {
        margin: 4px 0;
        display: flex;
        align-items: center;
    }

    .name-input {
        width: 200px;
    }

    .size-input {
        width: 80px;
    }

    #download-button {
        height: 40px;
        margin-top: 20px;
        border: none;
        color: #FFFFFF;
        background-color: #000000;
    }
</style>