import Indicator from "./indicator.js";



// 指定された要素を取得
const targetElement = document.getElementById("step_indicator"); // ここで指定の要素のIDに変更

if (targetElement == null) {
    throw new Error("指定された要素が存在しません");
} else {
    // 指定された要素を取得
    // Canvas要素を作成
    const canvas = document.createElement("canvas");
    targetElement.appendChild(canvas);

    // Canvasのコンテキストを取得
    const ctx = canvas.getContext("2d");

    // CanvasのCSSスタイルを設定して、表示サイズをターゲット要素の幅に合わせる
    canvas.style.width = "100%";
    canvas.style.height = "40px"; // インジケーターが収まる適切な高さを指定

    // 解像度を高くするためのスケール設定
    const scale = window.devicePixelRatio || 1;
    
    // ピクセルサイズを設定（実際の描画解像度）
    canvas.width = targetElement.clientWidth * scale;
    canvas.height = 40 * scale; // 表示サイズにスケールを適用

    // コンテキストのスケール設定
    ctx.scale(scale, scale);

    // インジケーターの幅をCanvasの幅に設定
    const indicatorWidth = targetElement.clientWidth;

    // インジケーターを中央（上下）に配置するためのy座標を計算
    const indicatorX = 0; // 左右は100%にしているため0に設定
    const indicatorY = 0; // インジケーターが中央に配置されるように調整

    // Indicatorクラスのインスタンスを作成
    const indicator = new Indicator(
        ctx,
        indicatorX,
        indicatorY,
        indicatorWidth,
        0,
        255,
        127,
        "#36D1DF",
        "#DDDDDD",
        "12px Arial",
        (newValue) => {
            console.log("New Value:", newValue);
        }
    );

    // インジケーターを描画
    indicator.draw();
}

const input = document.getElementById('step_value');

input.addEventListener('input', () => {
    // 最大値と最小値を取得
    const max = parseInt(input.max, 10);
    const min = parseInt(input.min, 10);
    let value = parseInt(input.value, 10);

    // 現在の入力値の桁数を計算
    const currentLength = input.value.length;

    // 1桁あたりの幅を計算（仮に10pxとします）
    const widthPerDigit = 10;
    // プレースホルダーなどの影響を考慮して幅を調整
    const baseWidth = 30; // 基本の幅（1桁またはプレースホルダー用のスペース）

    // 桁数に応じて幅を計算
    const newWidth = baseWidth + currentLength * widthPerDigit;

    // 最大幅を設定（最大桁数の幅を超えないように）
    const maxWidth = baseWidth + max.toString().length * widthPerDigit;

    // 入力フィールドの幅を更新（最大幅を超えない）
    input.style.width = `${Math.min(newWidth, maxWidth)}px`;

    // 値の範囲をチェックして調整
    if (value > max) {
        input.value = max; // 最大値を超えた場合は最大値に設定
    } else if (value < min) {
        input.value = min; // 最小値を下回った場合は最小値に設定
    }
});

// フィールドが空のときに最小値を設定
input.addEventListener('blur', () => {
    const min = parseInt(input.min, 10);
    if (input.value === '') {
        input.value = min; // フィールドが空のとき最小値を設定
    }
});


// Logic
document.getElementById('check-brightness').addEventListener('click', async () => {
    // 現在のタブを取得
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // コンテンツスクリプトにメッセージを送信
    chrome.tabs.sendMessage(tab.id, { action: 'calculateBrightness' }, (response) => {
        if (response) {
            console.log('Brightness Matrix from clicked image:', response.brightnessMatrix);
        }
    });
});