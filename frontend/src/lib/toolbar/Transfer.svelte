<script lang="ts">
    import Modal from "../Modal.svelte";
    import Download from "./Download.svelte";
    import Upload from "./Upload.svelte";

    import { modal } from "../../structures/shared.svelte";

    let transferType: string = $state("download");

    $effect((): void => {
        modal.title = `${ transferType.replace(/^\w/, (word: string) => word.toUpperCase()) } Image`;

        if (!modal.isOpen) {
            transferType = "download";
        }
    });
</script>

<div id="transfer">

    <!-- modal button -->
    <button
        id="transfer-button"
        onclick={ modal.open }>
        Download/Upload
    </button>
    <!-- modal button -->

    <!-- transfer modal -->
    <Modal modal={ modal }>
        <div id="transfer-modal">

            <!-- menu -->
            <div class="menu">
                <button
                    id="download-menu-button"
                    class="active"
                    class:active={ transferType === "download" }
                    class:deactive={ transferType === "upload" }
                    onclick={(): void => {
                        transferType = "download";
                    }}>
                    Download
                </button>
                <button
                    id="upload-menu-button"
                    class="deactive"
                    class:active={ transferType === "upload" }
                    class:deactive={ transferType === "download" }
                    onclick={(): void => {
                        transferType = "upload";
                    }}>
                    Upload
                </button>
            </div>
            <!-- menu -->

            
            {#if transferType === "download"}
                <Download></Download>
            {:else if transferType === "upload"}
                <Upload></Upload>
            {/if}
             
        </div>
    </Modal>
    <!-- transfer modal -->
     
</div>

<style>
    #transfer-button {
        width: 160px;
        height: 40px;
        border: none;
        font-weight: bold;
        color: #FFFFFF;
        background-color: #000000;
    }

    #transfer-modal {
        width: 360px;
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
        font-weight: bold;
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