import { ShapeDrawer } from "./shape-drawer.js";

export class MarchingSquares
{
    private _shapeDrawer: ShapeDrawer;

    private _resolution: number = 6;
    private _half_resolution: number = 3;

    private _columns: number = 0;
    private _rows: number = 0;

    private _color: string = 'black';

    private _isoValue: number = 0;

    private _interpolate: boolean = false;

    private _isoContourLUT: Uint8Array = new Uint8Array();
    private _scalarGrid: Uint32Array = new Uint32Array();

    public get resolution() {
        return this._resolution;
    }

    public set resolution(value: number) {
        this._resolution = value;
        this._half_resolution = Math.round(this._resolution / 2);

        this._rows = Math.round(this._shapeDrawer.height / this._resolution);
        this._columns = Math.round(this._shapeDrawer.width / this._resolution);
    }

    public set color(value: string) {
        this._color = value;
    }

    public set isoValue(value: number) {
        this._isoValue = value;
    }

    public get useInterpolation() {
        return this._interpolate;
    }
    public set useInterpolation(value: boolean) {
        this._interpolate = value;
    }

    public set isoContourLUT(value: Uint8Array) {
        this._isoContourLUT = value;
    }

    public set scalarGrid(value: Uint32Array) {
        this._scalarGrid = value;
    }

    constructor(shapeDrawer: ShapeDrawer) {
        this._shapeDrawer = shapeDrawer;
    }

    public drawDots(): void
    {
        this._shapeDrawer.clear();
        this._shapeDrawer.fillStyle = this._color;

        let x = 0, y = 0;
        let stride = 0;
        let j = 0;
        let size = 0;
        
        for (let i = 0; i < this._rows; i++) {
            stride = i * this._resolution * this._shapeDrawer.width;
            y = i * this._resolution;
            for (j = 0; j < this._columns; j++) {
                x = j * this._resolution;
                size = this._isoContourLUT[(this._scalarGrid[stride + x] << 24) >>> 24];
                this._shapeDrawer.drawDot(x, y, size);
            }
        }
    }

    public drawLines() {
        if(this._interpolate) {
            this.drawLinesInterpolated();
        } else {
            this.drawLinesRough();
        }
    }

    public drawTriangles() {
        if(this._interpolate) {
            this.drawTrianglesInterpolated();
        } else {
            this.drawTrianglesRough();
        }
    }

    private drawLinesRough() {

        this._shapeDrawer.clear();
        this._shapeDrawer.fillStyle = "rgb(0, 0, 0, 0)";
        this._shapeDrawer.strokeStyle = this._color;

        let grid_y = 0, grid_y1 = 0;

        let state = 0;

        let top_left = 0, top_right = 0, bottom_right = 0, bottom_left = 0;

        for (let i = 0; i < this._shapeDrawer.height - this._resolution; i+=this._resolution) {
            grid_y = i * this._shapeDrawer.width;
            grid_y1 = (i + this._resolution) * this._shapeDrawer.width;
            for (let j = 0; j < this._shapeDrawer.width - this._resolution; j+=this.resolution) {

                top_left = ((this._scalarGrid[grid_y + j]) << 24) >>> 24;
                top_right = ((this._scalarGrid[grid_y + (j + this._resolution)]) << 24) >>> 24;
                bottom_right = ((this._scalarGrid[grid_y1 + (j + this._resolution)]) << 24) >>> 24;
                bottom_left = ((this._scalarGrid[grid_y1 + j]) << 24) >>> 24;

                state = this._isoContourLUT[top_left] * 8 
                + this._isoContourLUT[top_right] * 4 
                + this._isoContourLUT[bottom_right] * 2 
                + this._isoContourLUT[bottom_left];

                switch (state) {
                    case 0:
                    case 15: continue;
                    case 1:
                    case 14: {
                        this._shapeDrawer.drawLine(j, i + this._half_resolution, j + this._half_resolution, i + this._resolution);
                    } break;
                    case 2:
                    case 13: {
                        this._shapeDrawer.drawLine(j + this._resolution, i + this._half_resolution, j + this._half_resolution, i + this._resolution);
                    } break;
                    case 3:
                    case 12: {
                        this._shapeDrawer.drawLine(j, i + this._half_resolution, j + this._resolution, i + this._half_resolution);
                    } break;
                    case 4:
                    case 11: {
                        this._shapeDrawer.drawLine(j + this._half_resolution, i, j + this._resolution, i + this._half_resolution);
                    } break;
                    case 5: {
                        this._shapeDrawer.drawLine(j + this._half_resolution, i, j, i + this._half_resolution);
                        this._shapeDrawer.drawLine(j + this._resolution, i + this._half_resolution, j + this._half_resolution, i + this._resolution);
                    } break;
                    case 6:
                    case 9: {
                        this._shapeDrawer.drawLine(j + this._half_resolution, i, j + this._half_resolution, i + this._resolution);
                    } break;
                    case 7:
                    case 8: {
                        this._shapeDrawer.drawLine(j + this._half_resolution, i, j, i + this._half_resolution);
                    } break;
                    case 10: {
                        this._shapeDrawer.drawLine(j + this._half_resolution, i, j + this._resolution, i + this._half_resolution);
                        this._shapeDrawer.drawLine(j, i + this._half_resolution, j + this._half_resolution, i + this._resolution);
                    } break;
                    default:
                        break;
                }
            }          
        }
    }

    private drawLinesInterpolated() {

        this._shapeDrawer.clear();
        this._shapeDrawer.fillStyle = "rgb(0, 0, 0, 0)";
        this._shapeDrawer.strokeStyle = this._color;

        let grid_y = 0, grid_y1 = 0;

        let state = 0;

        let top_left = 0, top_right = 0, bottom_right = 0, bottom_left = 0;

        for (let i = 0; i < this._shapeDrawer.height - this._resolution; i+=this._resolution) {
            grid_y = i * this._shapeDrawer.width;
            grid_y1 = (i + this._resolution) * this._shapeDrawer.width;
            for (let j = 0; j < this._shapeDrawer.width - this._resolution; j+=this.resolution) {

                top_left = ((this._scalarGrid[grid_y + j]) << 24) >>> 24;
                top_right = ((this._scalarGrid[grid_y + (j + this._resolution)]) << 24) >>> 24;
                bottom_right = ((this._scalarGrid[grid_y1 + (j + this._resolution)]) << 24) >>> 24;
                bottom_left = ((this._scalarGrid[grid_y1 + j]) << 24) >>> 24;

                state = this._isoContourLUT[top_left] * 8 
                + this._isoContourLUT[top_right] * 4 
                + this._isoContourLUT[bottom_right] * 2 
                + this._isoContourLUT[bottom_left];

                switch (state) {
                    case 0:
                    case 15: continue;
                    case 1:
                    case 14: {
                        const bottom_x = j + this.interpolate(bottom_left, bottom_right);
                        const left_y = i + this.interpolate(top_left, bottom_left);

                        this._shapeDrawer.drawLine(j, left_y, bottom_x, i + this._resolution);
                    } break;
                    case 2:
                    case 13: {
                        const bottom_x = j + this.interpolate(bottom_left, bottom_right);
                        const right_y = i + this.interpolate(top_right, bottom_right);

                        this._shapeDrawer.drawLine(j + this._resolution, right_y, bottom_x, i + this._resolution);
                    } break;
                    case 3:
                    case 12: {
                        const left_y = i + this.interpolate(top_left, bottom_left);
                        const right_y = i + this.interpolate(top_right, bottom_right);

                        this._shapeDrawer.drawLine(j, left_y, j + this._resolution, right_y);
                    } break;
                    case 4:
                    case 11: {
                        const top_x = j + this.interpolate(top_left, top_right);
                        const right_y = i + this.interpolate(top_right, bottom_right);

                        this._shapeDrawer.drawLine(top_x, i, j + this._resolution, right_y);
                    } break;
                    case 5: {
                        const top_x = j + this.interpolate(top_left, top_right);
                        const left_y = i + this.interpolate(top_left, bottom_left);
                        
                        this._shapeDrawer.drawLine(top_x, i, j, left_y);

                        const right_y = i + this.interpolate(top_right, bottom_right);
                        const bottom_x = j + this.interpolate(bottom_left, bottom_right);

                        this._shapeDrawer.drawLine(j + this._resolution, right_y, bottom_x, i + this._resolution);
                    } break;
                    case 6:
                    case 9: {
                        const top_x = j + this.interpolate(top_left, top_right);
                        const bottom_x = j + this.interpolate(bottom_left, bottom_right);

                        this._shapeDrawer.drawLine(top_x, i, bottom_x, i + this._resolution);
                    } break;
                    case 7:
                    case 8: {
                        const top_x = j + this.interpolate(top_left, top_right);
                        const left_y = i + this.interpolate(top_left, bottom_left);

                        this._shapeDrawer.drawLine(top_x, i, j, left_y);
                    } break;
                    case 10: {
                        const top_x = j + this.interpolate(top_left, top_right);
                        const right_y = i + this.interpolate(top_right, bottom_right);

                        this._shapeDrawer.drawLine(top_x, i, j + this._resolution, right_y);

                        const bottom_x = j + this.interpolate(bottom_left, bottom_right);
                        const left_y = i + this.interpolate(top_left, bottom_left);

                        this._shapeDrawer.drawLine(j, left_y, bottom_x, i + this._resolution);
                    } break;
                    default:
                        break;
                }
            }          
        }
    }

    private drawTrianglesRough() {

        this._shapeDrawer.clear();
        this._shapeDrawer.fillStyle = this._color;
        this._shapeDrawer.strokeStyle = this._color;

        let grid_y = 0, grid_y1 = 0;
        let state = 0;

        for (let i = 0; i < this._shapeDrawer.height - this._resolution; i+=this._resolution) {
            grid_y = i * this._shapeDrawer.width;
            grid_y1 = (i + this._resolution) * this._shapeDrawer.width;
            for (let j = 0; j < this._shapeDrawer.width - this._resolution; j+=this.resolution) {

                state = this._isoContourLUT[((this._scalarGrid[grid_y + j]) << 24) >>> 24] * 8 
                        + this._isoContourLUT[((this._scalarGrid[grid_y + (j + this._resolution)]) << 24) >>> 24] * 4 
                        + this._isoContourLUT[((this._scalarGrid[grid_y1 + (j + this._resolution)]) << 24) >>> 24] * 2 
                        + this._isoContourLUT[((this._scalarGrid[grid_y1 + j]) << 24) >>> 24];

                switch (state) {
                    case 0: continue;
                    case 1: {
                        this._shapeDrawer.drawTriangle(
                            j + this._half_resolution, i + this._resolution,
                            j, i + this._resolution,
                            j, i + this._half_resolution
                        );
                    } break;
                    case 2: {
                        this._shapeDrawer.drawTriangle(
                            j + this._resolution, i + this._half_resolution,
                            j + this._resolution, i + this._resolution,
                            j + this._half_resolution, i + this._resolution
                        );
                    } break;
                    case 3: {
                        this._shapeDrawer.drawRect(
                            j, i + this._half_resolution,
                            this._resolution, this._half_resolution,
                        );
                    } break;
                    case 4: {
                        this._shapeDrawer.drawTriangle(
                            j + this._half_resolution, i,
                            j + this._resolution, i,
                            j + this._resolution, i + this._half_resolution
                        );
                    } break;
                    case 5: {
                        this._shapeDrawer.drawPolyline([
                            j, i + this._half_resolution,
                            j + this._half_resolution, i,
                            j + this._resolution, i,
                            j + this._resolution, i + this._half_resolution,
                            j + this._half_resolution, i + this._resolution,
                            j, i + this._resolution,
                            j, i + this._half_resolution,
                        ]);
                    } break;
                    case 6: {
                        this._shapeDrawer.drawRect(
                            j + this._half_resolution, i,
                            this._half_resolution, this._resolution,
                        );
                    } break;
                    case 7: {
                        this._shapeDrawer.drawPolyline([
                            j + this._half_resolution, i,
                            j + this._resolution, i,
                            j + this._resolution, i + this._resolution,
                            j, i + this._resolution,
                            j, i + this._half_resolution,
                            j + this._half_resolution, i,
                        ]);
                    } break;
                    case 8: {
                        this._shapeDrawer.drawTriangle(
                            j, i,
                            j + this._half_resolution, i,
                            j, i + this._half_resolution
                        );
                    } break;
                    case 9: {
                        this._shapeDrawer.drawRect(
                            j, i,
                            this._half_resolution, this._resolution,
                        );
                    } break;
                    case 10: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            j + this._half_resolution, i,
                            j + this._resolution, i + this._half_resolution,
                            j + this._resolution, i + this._resolution,
                            j + this._half_resolution, i + this._resolution,
                            j, i + this._half_resolution,
                            j, i,
                        ]);
                    } break;
                    case 11: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            j + this._half_resolution, i,
                            j + this._resolution, i + this._half_resolution,
                            j + this._resolution, i + this._resolution,
                            j, i + this._resolution,
                            j, i,
                        ]);
                    } break;
                    case 12: {
                        this._shapeDrawer.drawRect(
                            j, i,
                            this._resolution, this._half_resolution,
                        );
                    } break;
                    case 13: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            j + this._resolution, i,
                            j + this._resolution, i + this._half_resolution,
                            j + this._half_resolution, i + this._resolution,
                            j, i + this._resolution,
                            j, i,
                        ]);
                    } break;
                    case 14: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            j + this._resolution, i,
                            j + this._resolution, i + this._resolution,
                            j + this._half_resolution, i + this._resolution,
                            j, i + this._half_resolution,
                            j, i,
                        ]);
                    } break;
                    case 15: {
                        this._shapeDrawer.drawRect(
                            j, i,
                            this._resolution, this._resolution,
                        );
                    } break;
                    default:
                        break;
                }
            }          
        }
    }

    private drawTrianglesInterpolated() {
        this._shapeDrawer.clear();
        this._shapeDrawer.fillStyle = this._color;
        this._shapeDrawer.strokeStyle = this._color;

        let j = 0;
        let grid_y = 0, grid_y1 = 0;
        let state = 0;

        let top_left = 0, top_right = 0, bottom_right = 0, bottom_left = 0;

        for (let i = 0; i < this._shapeDrawer.height - this._resolution; i+=this._resolution) {
            grid_y = i * this._shapeDrawer.width;
            grid_y1 = (i + this._resolution) * this._shapeDrawer.width;
            for (let j = 0; j < this._shapeDrawer.width - this._resolution; j+=this.resolution) {

                top_left = ((this._scalarGrid[grid_y + j]) << 24) >>> 24;
                top_right = ((this._scalarGrid[grid_y + (j + this._resolution)]) << 24) >>> 24;
                bottom_right = ((this._scalarGrid[grid_y1 + (j + this._resolution)]) << 24) >>> 24;
                bottom_left = ((this._scalarGrid[grid_y1 + j]) << 24) >>> 24;

                state = this._isoContourLUT[top_left] * 8 
                + this._isoContourLUT[top_right] * 4 
                + this._isoContourLUT[bottom_right] * 2 
                + this._isoContourLUT[bottom_left];

                const top_x = j + this.interpolate(top_left, top_right);
                const right_y = i + this.interpolate(top_right, bottom_right);
                const bottom_x = j + this.interpolate(bottom_left, bottom_right);
                const left_y = i + this.interpolate(top_left, bottom_left);

                switch (state) {
                    case 0: continue;
                    case 1: {
                        this._shapeDrawer.drawTriangle(
                            bottom_x, i + this._resolution,
                            j, i + this._resolution,
                            j, left_y
                        );
                    } break;
                    case 2: {
                        this._shapeDrawer.drawTriangle(
                            j + this._resolution, right_y,
                            j + this._resolution, i + this._resolution,
                            bottom_x, i + this._resolution
                        );
                    } break;
                    case 3: {
                        this._shapeDrawer.drawPolyline([
                            j, left_y,
                            j, right_y,
                            j + this._resolution, i + this._resolution,
                            j, i + this._resolution,
                            j, left_y,
                        ]);
                    } break;
                    case 4: {
                        this._shapeDrawer.drawTriangle(
                            top_x, i,
                            j + this._resolution, i,
                            j + this._resolution, right_y
                        );
                    } break;
                    case 5: {
                        this._shapeDrawer.drawPolyline([
                            j, left_y,
                            top_x, i,
                            j + this._resolution, i,
                            j + this._resolution, right_y,
                            bottom_x, i + this._resolution,
                            j, i + this._resolution,
                            j, left_y,
                        ]);
                    } break;
                    case 6: {
                        this._shapeDrawer.drawPolyline([
                            top_x, i,
                            j + this._resolution, i,
                            j + this._resolution, i + this._resolution,
                            bottom_x, i + this._resolution,
                            top_x, i,
                        ]);
                    } break;
                    case 7: {
                        this._shapeDrawer.drawPolyline([
                            top_x, i,
                            j + this._resolution, i,
                            j + this._resolution, i + this._resolution,
                            j, i + this._resolution,
                            j, left_y,
                            top_x, i,
                        ]);
                    } break;
                    case 8: {
                        this._shapeDrawer.drawTriangle(
                            j, i,
                            top_x, i,
                            j, left_y
                        );
                    } break;
                    case 9: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            top_x, i,
                            bottom_x, i + this._resolution,
                            j, i + this._resolution,
                            j, i,
                        ]);
                    } break;
                    case 10: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            top_x, i,
                            j + this._resolution, right_y,
                            j + this._resolution, i + this._resolution,
                            bottom_x, i + this._resolution,
                            j, left_y,
                            j, i,
                        ]);
                    } break;
                    case 11: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            top_x, i,
                            j + this._resolution, right_y,
                            j + this._resolution, i + this._resolution,
                            j, i + this._resolution,
                            j, i,
                        ]);
                    } break;
                    case 12: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            j + this._resolution, i,
                            j + this._resolution, right_y,
                            j, left_y,
                            j, i,
                        ]);
                    } break;
                    case 13: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            j + this._resolution, i,
                            j + this._resolution, right_y,
                            bottom_x, i + this._resolution,
                            j, i + this._resolution,
                            j, i,
                        ]);
                    } break;
                    case 14: {
                        this._shapeDrawer.drawPolyline([
                            j, i,
                            j + this._resolution, i,
                            j + this._resolution, i + this._resolution,
                            bottom_x, i + this._resolution,
                            j, left_y,
                            j, i,
                        ]);
                    } break;
                    case 15: {
                        this._shapeDrawer.drawRect(
                            j, i,
                            this._resolution, this._resolution,
                        );
                    } break;
                    default:
                        break;
                }
            }          
        }
    }
 
    private interpolate(a: number, b: number) {
        const lerp = Math.round(Math.abs(this._resolution * ((this._isoValue - a) / (a - b))));
        return Number.isFinite(lerp) ? lerp : this._half_resolution;
    }
}