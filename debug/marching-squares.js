export class MarchingSquares {
    //#region Dot Grid
    static drawDotGrid(field, ctx, width, height, res, threshold, color) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = color;
        const resW = width / res;
        const resH = height / res;
        const stride = res * width;
        let j = 0;
        for (let i = 0; i < resH - 1; i++) {
            for (j = 0; j < resW - 1; j++) {
                if (field[i * stride + j * res] > threshold) {
                    ctx.fillRect(j * res, i * res, 1, 1);
                }
            }
        }
    }
    //#endregion
    //#region Stroke Grid
    static drawStrokeGrid(field, ctx, width, height, res, threshold, color, linesLUT) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "rgb(0, 0, 0, 0)";
        ctx.strokeStyle = color;
        const coorsLUT = new Uint32Array(8);
        const halfRes = ((res * 0.5) + 0.5) | 0;
        const resW = width / res;
        const resH = height / res;
        const stride = res * width;
        let j = 0;
        let aIndex = 0, dIndex = 0;
        let a, b, c, d;
        for (let i = 0; i < resH - 1; i++) {
            for (j = 0; j < resW - 1; j++) {
                aIndex = i * stride + j * res;
                dIndex = (i + 1) * stride + j * res;
                a = threshold - field[aIndex] >>> 31 << 3;
                b = threshold - field[aIndex + 1] >>> 31 << 2;
                c = threshold - field[dIndex + 1] >>> 31 << 1;
                d = threshold - field[dIndex] >>> 31;
                MarchingSquares.drawStrokeCell(ctx, a + b + c + d, j * res, i * res, res, halfRes, coorsLUT, linesLUT);
            }
        }
    }
    static drawStrokeCell(ctx, state, x, y, res, halfRes, coorsLUT, linesLUT) {
        if (state === 0)
            return;
        coorsLUT[0] = x + halfRes;
        coorsLUT[1] = y;
        coorsLUT[2] = x + res;
        coorsLUT[3] = y + halfRes;
        coorsLUT[4] = x + halfRes;
        coorsLUT[5] = y + res;
        coorsLUT[6] = x;
        coorsLUT[7] = y + halfRes;
        if (state === 5 || state === 10) {
            ctx.beginPath();
            ctx.moveTo(coorsLUT[linesLUT[state] >> 28], coorsLUT[(linesLUT[state] << 4) >> 28]);
            ctx.lineTo(coorsLUT[(linesLUT[state] << 8) >> 28], coorsLUT[(linesLUT[state] << 12) >> 28]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(coorsLUT[(linesLUT[state] << 16) >> 28], coorsLUT[(linesLUT[state] << 20) >> 28]);
            ctx.lineTo(coorsLUT[(linesLUT[state] << 24) >> 28], coorsLUT[(linesLUT[state] << 28) >> 28]);
            ctx.stroke();
        }
        else {
            ctx.beginPath();
            ctx.moveTo(coorsLUT[linesLUT[state] >> 12], coorsLUT[(linesLUT[state] << 20) >> 28]);
            ctx.lineTo(coorsLUT[(linesLUT[state] << 24) >> 28], coorsLUT[(linesLUT[state] << 28) >> 28]);
            ctx.stroke();
        }
    }
    //#endregion
    //#region Filled Grid
    static drawFilledGrid(field, ctx, width, height, res, threshold, color, triangles) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = color;
        const coorsLUT = new Uint32Array(16);
        const halfRes = ((res * 0.5) + 0.5) | 0;
        const resW = width / res;
        const resH = height / res;
        const stride = res * width;
        let j = 0;
        let aIndex = 0, dIndex = 0;
        let a, b, c, d;
        for (let i = 0; i < resH - 1; i++) {
            for (j = 0; j < resW - 1; j++) {
                aIndex = i * stride + j * res;
                dIndex = (i + 1) * stride + j * res;
                a = threshold - field[aIndex] >>> 31 << 3;
                b = threshold - field[aIndex + 1] >>> 31 << 2;
                c = threshold - field[dIndex + 1] >>> 31 << 1;
                d = threshold - field[dIndex] >>> 31;
                MarchingSquares.drawFilledCell(ctx, a + b + c + d, j * res, i * res, res, halfRes, coorsLUT, triangles);
            }
        }
    }
    static drawFilledCell(ctx, state, x, y, res, halfRes, coorsLUT, trianglesLUT) {
        coorsLUT[0] = x;
        coorsLUT[1] = y;
        coorsLUT[2] = x + halfRes;
        coorsLUT[3] = y;
        coorsLUT[4] = x + res;
        coorsLUT[5] = y;
        coorsLUT[6] = x + res;
        coorsLUT[7] = y + halfRes;
        coorsLUT[8] = x + res;
        coorsLUT[9] = y + res;
        coorsLUT[10] = x + halfRes;
        coorsLUT[11] = y + res;
        coorsLUT[12] = x;
        coorsLUT[13] = y + res;
        coorsLUT[14] = x;
        coorsLUT[15] = y + halfRes;
        const tgls = trianglesLUT[state];
        let tgl;
        ctx.beginPath();
        for (let k = 0; k < tgls.length; k++) {
            tgl = tgls[k];
            ctx.moveTo(coorsLUT[tgl[0]], coorsLUT[tgl[1]]);
            ctx.lineTo(coorsLUT[tgl[2]], coorsLUT[tgl[3]]);
            ctx.lineTo(coorsLUT[tgl[4]], coorsLUT[tgl[5]]);
        }
        ctx.fill();
    }
    //#endregion
    //#region LUT
    static getLinesLUT() {
        const linesLUT = new Uint32Array(16);
        linesLUT[1] = (4 << 12) + (5 << 8) + (6 << 4) + 7;
        linesLUT[2] = (2 << 12) + (3 << 8) + (4 << 4) + 5;
        linesLUT[3] = (2 << 12) + (3 << 8) + (6 << 4) + 7;
        linesLUT[4] = (0 << 12) + (1 << 8) + (2 << 4) + 3;
        linesLUT[5] = (0 << 28) + (1 << 24) + (6 << 20) + (7 << 16) + (2 << 12) + (3 << 8) + (4 << 4) + 5;
        linesLUT[6] = (0 << 12) + (1 << 8) + (4 << 4) + 5;
        linesLUT[7] = (0 << 12) + (1 << 8) + (6 << 4) + 7;
        linesLUT[8] = (0 << 12) + (1 << 8) + (6 << 4) + 7;
        linesLUT[9] = (0 << 12) + (1 << 8) + (4 << 4) + 5;
        linesLUT[10] = (0 << 28) + (1 << 24) + (2 << 20) + (3 << 16) + (4 << 12) + (5 << 8) + (6 << 4) + 7;
        linesLUT[11] = (0 << 12) + (1 << 8) + (2 << 4) + 3;
        linesLUT[12] = (2 << 12) + (3 << 8) + (6 << 4) + 7;
        linesLUT[13] = (2 << 12) + (3 << 8) + (4 << 4) + 5;
        linesLUT[14] = (4 << 12) + (5 << 8) + (6 << 4) + 7;
        return linesLUT;
    }
    static getTriangleLUT() {
        const trianglesLUT = new Array(16);
        trianglesLUT[0] = new Array(0);
        trianglesLUT[1] = new Array(new Array(10, 11, 12, 13, 14, 15));
        trianglesLUT[2] = new Array(new Array(6, 7, 8, 9, 10, 11));
        trianglesLUT[3] = new Array(new Array(6, 7, 8, 9, 12, 13), new Array(6, 7, 12, 13, 14, 15));
        trianglesLUT[4] = new Array(new Array(2, 3, 4, 5, 6, 7));
        trianglesLUT[5] = new Array(new Array(2, 3, 4, 5, 6, 7), new Array(2, 3, 6, 7, 10, 11), new Array(2, 3, 10, 11, 12, 13), new Array(2, 3, 12, 13, 14, 15));
        trianglesLUT[6] = new Array(new Array(2, 3, 4, 5, 8, 9), new Array(2, 3, 8, 9, 10, 11));
        trianglesLUT[7] = new Array(new Array(2, 3, 4, 5, 8, 9), new Array(2, 3, 8, 9, 12, 13), new Array(2, 3, 12, 13, 14, 15));
        trianglesLUT[8] = new Array(new Array(0, 1, 2, 3, 14, 15));
        trianglesLUT[9] = new Array(new Array(0, 1, 2, 3, 10, 11), new Array(0, 1, 10, 11, 12, 13));
        trianglesLUT[10] = new Array(new Array(0, 1, 2, 3, 6, 7), new Array(0, 1, 6, 7, 8, 9), new Array(0, 1, 8, 9, 10, 11), new Array(0, 1, 10, 11, 14, 15));
        trianglesLUT[11] = new Array(new Array(0, 1, 2, 3, 6, 7), new Array(0, 1, 6, 7, 8, 9), new Array(0, 1, 8, 9, 12, 13));
        trianglesLUT[12] = new Array(new Array(0, 1, 4, 5, 6, 7), new Array(0, 1, 6, 7, 14, 15));
        trianglesLUT[13] = new Array(new Array(0, 1, 4, 5, 6, 7), new Array(0, 1, 6, 7, 10, 11), new Array(0, 1, 10, 11, 12, 13));
        trianglesLUT[14] = new Array(new Array(0, 1, 4, 5, 8, 9), new Array(0, 1, 8, 9, 10, 11), new Array(0, 1, 10, 11, 14, 15));
        trianglesLUT[15] = new Array(new Array(0, 1, 4, 5, 8, 9), new Array(0, 1, 8, 9, 12, 13));
        return trianglesLUT;
    }
}
//# sourceMappingURL=marching-squares.js.map