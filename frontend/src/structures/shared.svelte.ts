import type { CanvasInfo, CanvasOption, Position, Modal, OffscreenCanvasInstance } from "../types";

const canvasInfo: CanvasInfo = $state({
    width: 0,
    height: 0,
    xStart: 0,
    yStart: 0,
    xEnd: 0,
    yEnd: 0,
    xTranslate: 0,
    yTranslate: 0,
    overlayCanvasVisibility: true
});

const canvasOption: CanvasOption = $state({
    width: 32,
    height: 32,
    zoomFactor: 1,
    mainColor: "#ff0000",
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

const offscreenCanvasInstance: OffscreenCanvasInstance = $state({
    canvas: new OffscreenCanvas(0, 0),
    context: new OffscreenCanvas(0, 0).getContext("2d") as OffscreenCanvasRenderingContext2D,
    update: (width: number, height: number): void => {},
});

export {
    canvasInfo,
    canvasOption,
    position,
    modal,
    offscreenCanvasInstance,
};