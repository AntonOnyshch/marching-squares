export class ISOSurface2DGenerator {

    private _inputData: Uint8Array | Uint16Array | Uint32Array;

    private _resolution: number;

    public set resolution(value: number) {
        this._resolution = value;
    }

    private _threshold: number;

    public set threshold(value: number) {
        this._threshold = value;
    }

    public readonly outData: Uint32Array;

    constructor(inputData: Uint8Array | Uint16Array | Uint32Array, width: number, height: number) {
        this._resolution = 5;
        this._inputData = inputData;

        this._threshold = 0;

        this.outData = new Uint32Array(width * height);
    }

    public generate(comparisonType: 'less' | 'equal' | 'more') {
        switch (comparisonType) {
            case 'less': {
                for (let i = 0; i < this._inputData.length; i++) {
                    this.outData[i * this._resolution] = this._inputData[i * this._resolution] < this._threshold ? 1 : 0;
                }
            } break;
            case 'equal': {
                for (let i = 0; i < this._inputData.length; i++) {
                    this.outData[i * this._resolution] = this._inputData[i * this._resolution] === this._threshold ? 1 : 0;
                }
            } break;
            case 'more': {
                for (let i = 0; i < this._inputData.length; i++) {
                    this.outData[i * this._resolution] = this._inputData[i * this._resolution] > this._threshold ? 1 : 0;
                }
            } break;
            default:
                break;
        }
    }

    public generateRandom() {
        for (let i = 0; i < this._inputData.length; i++) {
            this.outData[i] =  Math.floor(Math.random() * Math.floor(2));
        }
    }
}