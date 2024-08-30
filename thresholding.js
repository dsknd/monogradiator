export default class Thresholding {
    constructor(imageData) {
        this.imageData = imageData;
        this.threshold = 128;
        this.brightnessMatrix = this.setImageBrightnessMatrix(imageData);
    }


    setThreshold(value) {
        this.threshold = value;
    }

    setImageBrightnessMatrix(imageElement) {
        if (imageElement instanceof HTMLImageElement) {
            const width = imageElement.width;
            const height = imageElement.height;

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext('2d');

            context.drawImage(imageElement, 0, 0, width, height);

            const imageData = context.getImageData(0, 0, width, height);
            const data = imageData.data;

            const brightnessMatrix = [];

            for (let y = 0; y < height; y++) {
                const row = [];
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];
                    const brightness = (r + g + b) / 3;
                    row.push(brightness);
                }
                brightnessMatrix.push(row);
            }
        }
        return brightnessMatrix;
    }

}