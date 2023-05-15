export interface ShapeDrawer {

    set strokeStyle(value: string);
    set fillStyle(value: string);

    set filled(value: boolean);

    readonly width: number;
    readonly height: number;

    clear(): void;

    drawDot(x: number, y: number, size: number): void;
    drawLine(x1: number, y1: number, x2: number, y2: number): void;
    drawStrokeTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    drawFilledTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    drawRect(x: number, y: number, width: number, height: number): void;
    drawPolyline(coords: number[]): void;
}