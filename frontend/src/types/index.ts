export interface CanvasInfo {
    width: number;
    height: number;
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
    xTranslate: number,
    yTranslate: number,
}

export interface CanvasOption {
    pixelSize: number;
    zoomFactor: number;
    mainColor: string;
    subColor: string;
}

export interface Position {
    x: number;
    y: number;
    isOutOfCanvas: boolean;
};