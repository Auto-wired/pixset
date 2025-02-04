export interface CanvasInfo {
    width: number;
    height: number;
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
}

export interface Position {
    x: number;
    y: number;
    xTranslate: number,
    yTranslate: number,
    isOutOfCanvas: boolean;
};