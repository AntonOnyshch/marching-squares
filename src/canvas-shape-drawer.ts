import { ShapeDrawer } from "./shape-drawer";

export class CanvasShapeDrawer implements ShapeDrawer {

    private readonly _ctx: CanvasRenderingContext2D;

    private _filled: boolean = false;

    public readonly width: number;
    public readonly height: number;

    public set strokeStyle(value: string) {
        this._ctx.strokeStyle = value;
    }

    public set fillStyle(value: string) {
        this._ctx.fillStyle = value;
    }

    public set filled(value: boolean) {
        this._filled = value;
    }

    constructor(ctx: CanvasRenderingContext2D) {
        this._ctx = ctx;

        this.width = this._ctx.canvas.width;
        this.height = this._ctx.canvas.height;
    }
    
    clear(): void {
        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.width);
    }

    drawDot(x: number, y: number, size: number): void {
        this._ctx.fillRect(x, y, size, size);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number): void {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.stroke();
    }

    drawStrokeTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.lineTo(x3, y3);
        this._ctx.closePath();
        this._ctx.stroke();
    }

    drawFilledTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.lineTo(x3, y3);
        this._ctx.fill();
    }
    drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.lineTo(x3, y3);
        
        if(this._filled) {
            this._ctx.fill();
        } else {
            this._ctx.closePath();
            this._ctx.stroke();
        }
    }
    drawRect(x: number, y: number, width: number, height: number) {
        if(this._filled) {
            this._ctx.fillRect(x, y, width, height);
        } else {
            this._ctx.strokeRect(x, y, width, height);
        }
    }

    drawPolyline(coords: number[]) {
        this._ctx.beginPath();
        this._ctx.moveTo(coords[0], coords[1]);
        for (let i = 2; i < coords.length; i+=2) {
            this._ctx.lineTo(coords[i], coords[i + 1]);
        }
        if(this._filled) {
            this._ctx.fill();
        } else {
            this._ctx.stroke();
        }
    }

}