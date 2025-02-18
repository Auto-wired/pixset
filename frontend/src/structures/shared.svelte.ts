import type { CanvasInfo, CanvasOption, Position, Modal } from "../types";

const canvasInfo: CanvasInfo = $state({
    width: 0,
    height: 0,
    xStart: 0,
    yStart: 0,
    xEnd: 0,
    yEnd: 0,
    xTranslate: 0,
    yTranslate: 0,
    overlayCanvasVisibility: true,
    imageDataUrl: "",
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

const modal: Modal = $state({
    isOpen: false,
    title: "",
    open: (): void => {
        modal.isOpen = true;
    },
    close: (): void => {
        modal.isOpen = false;
    },
});

export {
    canvasInfo,
    canvasOption,
    position,
    modal,
};