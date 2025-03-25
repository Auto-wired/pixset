export interface Size {
    width: number;
    height: number;
}

export interface CanvasInfo extends Size {
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    xTranslate: number;
    yTranslate: number;
    overlayCanvasVisibility: boolean;
};

export interface CanvasOption extends Size {
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

export interface OffscreenCanvasInstance {
    canvas: OffscreenCanvas;
    context: OffscreenCanvasRenderingContext2D;
    update: (width: number, height: number) => void;
}