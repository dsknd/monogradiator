// コンテンツスクリプト：クリックされた画像の輝度を計算
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'calculateBrightness') {
        const images = document.querySelectorAll('img'); // 全ての画像を選択
        images.forEach((img) => {
            img.addEventListener('click', () => {
                const brightnessMatrix = getImageBrightnessMatrix(img);
                console.log('Brightness Matrix:', brightnessMatrix);
                sendResponse({ brightnessMatrix });
            });
        });
        return true; // 非同期で応答するために true を返す
    }
});

function getImageBrightnessMatrix(imageElement) {
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

    return brightnessMatrix;
}