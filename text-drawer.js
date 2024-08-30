export default class TextDrawer {
    constructor(ctx) {
        this.ctx = ctx;
        this.text = '';
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 20;
        this.align = 'center';
        this.font = '20px Arial';
        this.color = '#DDDDDD';
        this.debug = false;
    }

    setText(text) {
        this.text = text;
        return this; // メソッドチェーンを可能にする
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this; // メソッドチェーンを可能にする
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        return this; // メソッドチェーンを可能にする
    }

    setAlignment(align) {
        this.align = align;
        return this; // メソッドチェーンを可能にする
    }

    setFont(font) {
        this.font = font;
        return this; // メソッドチェーンを可能にする
    }

    setColor(color) {
        this.color = color;
        return this; // メソッドチェーンを可能にする
    }

    enableDebug(debug = true) {
        this.debug = debug;
        return this; // メソッドチェーンを可能にする
    }

    draw() {
        // フォントの設定
        this.ctx.font = this.font;
        this.ctx.textBaseline = 'top';

        // テキストの揃え方の設定
        if (this.align === 'left') {
            this.ctx.textAlign = 'left';
            var textX = this.x;
        } else if (this.align === 'right') {
            this.ctx.textAlign = 'right';
            var textX = this.x + this.width;
        } else {
            this.ctx.textAlign = 'center';
            var textX = this.x + this.width / 2;
        }

        // var textY = this.y + this.height + 10; // テキストのY座標
        var textY = this.y; // テキストのY座標

        // テキストの描画
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(this.text, textX, textY);

        // デバッグ用の破線の罫線
        if (this.debug) {
            this.ctx.setLineDash([5, 5]);
            this.ctx.strokeStyle = 'red';
            this.ctx.strokeRect(this.x, textY, this.width, 24);
            this.ctx.setLineDash([]);
        }

        return this; // メソッドチェーンを可能にする
    }
}