export interface CanvasInfo {
    width: number;
    height: number;
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    xTranslate: number,
    yTranslate: number,
    overlayCanvasVisibility: boolean,
    imageDataUrl: string,
};

export interface CanvasOption {
    pixelSize: number;
    zoomFactor: number;
    mainColor: string;
    subColor: string;
};

export interface Position {
    x: number;
    y: number;
    isOutOfCanvas: boolean;
};

export interface Modal {
    isOpen: boolean;
    title: string;
    open: () => void;
    close: () => void;
};