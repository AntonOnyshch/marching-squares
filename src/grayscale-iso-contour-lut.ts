
export class GrayscaleISOContourLUT {

    public readonly lut: Uint8Array;

    private _isoValue: number = 0;
    public get isoValue() {
        return this._isoValue;
    }

    constructor(lutLength: number) {
        this.lut = new Uint8Array(lutLength);
    }

    public generate(isoValue: number, comparisonType: 'less' | 'equal' | 'more') {
        switch (comparisonType) {
            case 'less': {
                this.lut.forEach((_value, i, array) => array[i] = i <= isoValue ? 1 : 0);
            } break;
            case 'equal': {
                this.lut.forEach((_value, i, array) => array[i] = i === isoValue ? 1 : 0);
            } break;
            case 'more': {
                this.lut.forEach((_value, i, array) => array[i] = i > isoValue ? 1 : 0);
            } break;
            default:
                break;
        }
    }

    public generateRandom() {
        for (let i = 0; i < this.lut.length; i++) {
            this.lut[i] =  Math.floor(Math.random() * Math.floor(2));
        }
    }
}