<script lang="ts">
    import { canvasOption, position } from "../../structures/shared.svelte";
</script>

<div id="inspector">
    <p>x{ canvasOption.zoomFactor }</p>
    <p>{ canvasOption.pixelSize } X { canvasOption.pixelSize }</p>

    { #if !position.isOutOfCanvas && position.x >= 0 && position.x < canvasOption.pixelSize && position.y >= 0 && position.y < canvasOption.pixelSize }
        <p>{ position.x } : { position.y }</p>
    { /if }
</div>

<style>
    #inspector {
        width: 15%;
        height: 95%;
        padding-left: 4px;
    }
</style>