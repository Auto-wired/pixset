<script lang="ts">
    import type { Modal } from "../types";
    import type { Snippet } from "svelte";

    let { modal, children }: { modal: Modal, children: Snippet } = $props();
</script>

{#if modal.isOpen}
    <div class="modal">
        <div
            role="none"
            class="background"
            onclick={ modal.close }>
        </div>
        <div class="content">
            <div class="header">
                <p class="title">{ modal.title }</p>
                <button
                    class="close-button"
                    onclick={ modal.close }>
                    X
                </button>
            </div>
            {@render children()}
        </div>
    </div>
{/if}

<style>
    .modal {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
    }

    .background {
        width: 100%;
        height: 100%;
        opacity: 0.7;
        background-color: #000000;
    }

    .content {
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #FFFFFF;
    }

    .header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        border-bottom: 1px solid #000000;
    }

    .header > * {
        margin: 12px;
    }

    .title {
        font-weight: bold;
    }

    .close-button {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        border: none;
        color: #FFFFFF;
        background-color: #000000;
    }
</style>