import type { CanvasInfo, CanvasOption, Position } from "../types";

const canvasInfo: CanvasInfo = $state({
    width: 0,
    height: 0,
    xStart: 0,
    yStart: 0,
    xEnd: 0,
    yEnd: 0,
    xTranslate: 0,
    yTranslate: 0,
});

const canvasOption: CanvasOption = $state({
    pixelSize: 32,
    zoomFactor: 1,
    mainColor: "#000000",
    subColor: "#ffffff",
});

const position: Position = $state({
    x: -1,
    y: -1,
    isOutOfCanvas: true,
});

export { canvasInfo, canvasOption, position };