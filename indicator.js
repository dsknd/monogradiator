// // indicator.js

import RectDrawer from "./rect-drawer.js";
import TextDrawer from "./text-drawer.js";
import hex2rgba from "./hex2rgba.js";



export default class Indicator {
    constructor(ctx, x, y, width, min_value, max_value, current_value = 0, foregrand_color = "#36D1DF", background_color = "#DDDDDD", font = "12px Arial", onChangeCallback = null) {
        // 引数の論理チェック
        if (max_value <= min_value) {
            throw new Error("max_value must be greater than min_value.");
        }
        if (current_value < min_value || current_value > max_value) {
            throw new Error("current_value must be between min_value and max_value.");
        }

        this.ctx = ctx;
        this.x = x; // インジケーターのX位置
        this.y = y; // インジケーターのY位置
        this.width = width; // インジケーターの幅
        this.min_value = min_value;
        this.max_value = max_value;
        this.current_value = Math.round(current_value); // 初期値を整数にスナップ
        this.foregrand_color = foregrand_color;
        this.background_color = background_color;
        this.font = font;
        this.onChangeCallback = onChangeCallback;

        // バーの高さを定義
        this.barHeight = 10;

        // クリックやドラッグをハンドリングするためのバインディング
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        // イベントリスナーの追加
        this.ctx.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.ctx.canvas.addEventListener('mouseup', this.handleMouseUp);
    }

    setCurrentValue(value) {
        // `current_value`を整数に四捨五入し、範囲を制限
        this.current_value = Math.round(Math.max(this.min_value, Math.min(value, this.max_value)));
        
        // コールバック関数を呼び出し
        if (this.onChangeCallback) {
            this.onChangeCallback(this.current_value);
        }

        // 再描画
        this.draw();
    }

    handleMouseDown(event) {
        // マウスがバー領域内かどうかを確認
        if (this.isInBarArea(event)) {
            this.ctx.canvas.addEventListener('mousemove', this.handleMouseMove);
            this.updateValueFromEvent(event);
        }
    }

    handleMouseMove(event) {
        this.updateValueFromEvent(event);
    }

    handleMouseUp() {
        this.ctx.canvas.removeEventListener('mousemove', this.handleMouseMove);
    }

    // isInBarArea(event) {
    //     const rect = this.ctx.canvas.getBoundingClientRect();
    //     const mouseX = event.clientX - rect.left;
    //     const mouseY = event.clientY - rect.top;
    //     // インジケーターのXオフセットを考慮してクリック範囲を確認
    //     return mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.barHeight;
    // }

    isInBarArea(event) {
        const rect = this.ctx.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // クリック範囲をX方向とY方向にそれぞれ10ピクセル拡張
        const extraMargin = 10;
    
        // インジケーターのXオフセットを考慮して、判定範囲に余裕を持たせてクリック範囲を確認
        return mouseX >= this.x - extraMargin && mouseX <= this.x + this.width + extraMargin &&
               mouseY >= this.y - extraMargin && mouseY <= this.y + this.barHeight + extraMargin;
    }

    updateValueFromEvent(event) {
        const rect = this.ctx.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        // インジケーターのXオフセットを考慮して新しい値を計算
        const newValue = this.min_value + ((mouseX - this.x) / this.width) * (this.max_value - this.min_value);
        this.setCurrentValue(newValue); // 四捨五入して整数にスナップ
    }

    draw() {
        // キャンバスをクリア
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        let mid_value = (this.max_value + this.min_value) / 2;
        let int_mid_value = Math.floor(mid_value);

        // 背景のバーを描画
        new RectDrawer(this.ctx)
            .setPosition(this.x, this.y)
            .setSize(this.width, this.barHeight)
            .setColor(this.background_color)
            .setRadius(7)
            .draw();

        // テキストを描画
        new TextDrawer(this.ctx)
            .setText(`${this.min_value}`)
            .setPosition(this.x, this.y + 20)
            .setSize(this.width, 10)
            .setAlignment('left')
            .setFont(this.font)
            .setColor(this.background_color)  // フォント色を見えやすく設定
            .draw();

        new TextDrawer(this.ctx)
            .setText(`${int_mid_value}`)
            .setPosition(this.x, this.y + 20)
            .setSize(this.width, 10)
            .setAlignment('center')
            .setFont(this.font)
            .setColor(this.background_color)
            .draw();

        new TextDrawer(this.ctx)
            .setText(`${this.max_value}`)
            .setPosition(this.x, this.y + 20)
            .setSize(this.width, 10)
            .setAlignment('right')
            .setFont(this.font)
            .setColor(this.background_color)
            .draw();

        // オフスクリーンCanvasの作成
        const scaleFactor = window.devicePixelRatio || 1;
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = this.width * scaleFactor;
        offscreenCanvas.height = this.barHeight * scaleFactor;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.scale(scaleFactor, scaleFactor);

        // メインの背景の図形をオフスクリーンCanvasで描画
        new RectDrawer(offscreenCtx)
            .setPosition(0, 0)
            .setSize(this.width, this.barHeight)
            .setColor(this.background_color)
            .setRadius(7)
            .draw();

        // 合成モードを適用して進行度を示す図形を描画
        offscreenCtx.globalCompositeOperation = 'source-in';
        new RectDrawer(offscreenCtx)
            .setPosition(0, 0)
            .setSize((this.current_value / this.max_value) * this.width, this.barHeight)
            .setColor(this.foregrand_color)
            .setRadius(0)
            .draw();

        // メインCanvasにシャドウを設定してオフスクリーンCanvasの内容を描画
        this.ctx.shadowColor = hex2rgba(this.foregrand_color, 0.5);
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 10;

        // 高解像度のオフスクリーンCanvasをメインCanvasに描画
        this.ctx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, this.x, this.y, this.width, this.barHeight);

        // シャドウのリセット
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }
}