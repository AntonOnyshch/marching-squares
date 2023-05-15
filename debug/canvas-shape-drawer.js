export class CanvasShapeDrawer {
    _ctx;
    _filled = false;
    width;
    height;
    set strokeStyle(value) {
        this._ctx.strokeStyle = value;
    }
    set fillStyle(value) {
        this._ctx.fillStyle = value;
    }
    set filled(value) {
        this._filled = value;
    }
    constructor(ctx) {
        this._ctx = ctx;
        this.width = this._ctx.canvas.width;
        this.height = this._ctx.canvas.height;
    }
    clear() {
        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.width);
    }
    drawDot(x, y, size) {
        this._ctx.fillRect(x, y, size, size);
    }
    drawLine(x1, y1, x2, y2) {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.stroke();
    }
    drawStrokeTriangle(x1, y1, x2, y2, x3, y3) {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.lineTo(x3, y3);
        this._ctx.closePath();
        this._ctx.stroke();
    }
    drawFilledTriangle(x1, y1, x2, y2, x3, y3) {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.lineTo(x3, y3);
        this._ctx.fill();
    }
    drawTriangle(x1, y1, x2, y2, x3, y3) {
        this._ctx.beginPath();
        this._ctx.moveTo(x1, y1);
        this._ctx.lineTo(x2, y2);
        this._ctx.lineTo(x3, y3);
        if (this._filled) {
            this._ctx.fill();
        }
        else {
            this._ctx.closePath();
            this._ctx.stroke();
        }
    }
    drawRect(x, y, width, height) {
        if (this._filled) {
            this._ctx.fillRect(x, y, width, height);
        }
        else {
            this._ctx.strokeRect(x, y, width, height);
        }
    }
    drawPolyline(coords) {
        this._ctx.beginPath();
        this._ctx.moveTo(coords[0], coords[1]);
        for (let i = 2; i < coords.length; i += 2) {
            this._ctx.lineTo(coords[i], coords[i + 1]);
        }
        if (this._filled) {
            this._ctx.fill();
        }
        else {
            this._ctx.stroke();
        }
    }
}
//# sourceMappingURL=canvas-shape-drawer.js.map