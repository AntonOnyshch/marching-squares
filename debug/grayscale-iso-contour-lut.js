export class GrayscaleISOContourLUT {
    lut;
    _isoValue = 0;
    get isoValue() {
        return this._isoValue;
    }
    constructor(lutLength) {
        this.lut = new Uint8Array(lutLength);
    }
    generate(isoValue, comparisonType) {
        switch (comparisonType) {
            case 'less':
                {
                    this.lut.forEach((_value, i, array) => array[i] = i <= isoValue ? 1 : 0);
                }
                break;
            case 'equal':
                {
                    this.lut.forEach((_value, i, array) => array[i] = i === isoValue ? 1 : 0);
                }
                break;
            case 'more':
                {
                    this.lut.forEach((_value, i, array) => array[i] = i > isoValue ? 1 : 0);
                }
                break;
            default:
                break;
        }
    }
    generateRandom() {
        for (let i = 0; i < this.lut.length; i++) {
            this.lut[i] = Math.floor(Math.random() * Math.floor(2));
        }
    }
}
//# sourceMappingURL=grayscale-iso-contour-lut.js.map