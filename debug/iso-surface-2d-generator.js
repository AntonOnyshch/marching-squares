export class ISOSurface2DGenerator {
    _inputData;
    _resolution;
    set resolution(value) {
        this._resolution = value;
    }
    _threshold;
    set threshold(value) {
        this._threshold = value;
    }
    outData;
    constructor(inputData, width, height) {
        this._resolution = 5;
        this._inputData = inputData;
        this._threshold = 0;
        this.outData = new Uint32Array(width * height);
    }
    generate(comparisonType) {
        switch (comparisonType) {
            case 'less':
                {
                    for (let i = 0; i < this._inputData.length; i++) {
                        this.outData[i * this._resolution] = this._inputData[i * this._resolution] < this._threshold ? 1 : 0;
                    }
                }
                break;
            case 'equal':
                {
                    for (let i = 0; i < this._inputData.length; i++) {
                        this.outData[i * this._resolution] = this._inputData[i * this._resolution] === this._threshold ? 1 : 0;
                    }
                }
                break;
            case 'more':
                {
                    for (let i = 0; i < this._inputData.length; i++) {
                        this.outData[i * this._resolution] = this._inputData[i * this._resolution] > this._threshold ? 1 : 0;
                    }
                }
                break;
            default:
                break;
        }
    }
    generateRandom() {
        for (let i = 0; i < this._inputData.length; i++) {
            this.outData[i] = Math.floor(Math.random() * Math.floor(2));
        }
    }
}
//# sourceMappingURL=iso-surface-2d-generator.js.map