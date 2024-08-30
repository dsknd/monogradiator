// Appearance: popup.html
export default class RectDrawer {
    constructor(ctx) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.width = 100;
        this.height = 50;
        this.radius = 0;
        this.color = 'black';
        this.shadowColor = 'transparent';
        this.shadowBlur = 0;
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;
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

    setRadius(radius) {
        this.radius = radius;
        return this; // メソッドチェーンを可能にする
    }

    setColor(color) {
        this.color = color;
        return this; // メソッドチェーンを可能にする
    }

    setShadow(color, blur, offsetX, offsetY, opacity = 1) {
        // colorが文字列の指定の場合はそのまま代入
        // colorがhex形式の場合はrgba形式に変換
        if (color.match(/^#[0-9A-Fa-f]{6}$/)) {
            let r = parseInt(color.slice(1, 3), 16);
            let g = parseInt(color.slice(3, 5), 16);
            let b = parseInt(color.slice(5, 7), 16);
            color = `rgba(${r}, ${g}, ${b}, 1)`;
        }
        // opacityが1未満の場合はcolorの透明度を変更
        if (opacity < 1) {
            let rgb = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
            color = `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${opacity})`;
        }

        this.shadowColor = color;
        this.shadowBlur = blur;
        this.shadowOffsetX = offsetX;
        this.shadowOffsetY = offsetY;
        return this; // メソッドチェーンを可能にする
    }

    draw() {
        // シャドウの設定
        this.ctx.shadowColor = this.shadowColor;
        this.ctx.shadowBlur = this.shadowBlur;
        this.ctx.shadowOffsetX = this.shadowOffsetX;
        this.ctx.shadowOffsetY = this.shadowOffsetY;

        // 角丸の矩形の描画
        this.ctx.beginPath();
        this.ctx.moveTo(this.x + this.radius, this.y);
        this.ctx.lineTo(this.x + this.width - this.radius, this.y);
        this.ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.radius);
        this.ctx.lineTo(this.x + this.width, this.y + this.height - this.radius);
        this.ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.radius, this.y + this.height);
        this.ctx.lineTo(this.x + this.radius, this.y + this.height);
        this.ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.radius);
        this.ctx.lineTo(this.x, this.y + this.radius);
        this.ctx.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
        this.ctx.closePath();
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

        // シャドウのリセット
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        return this; // メソッドチェーンを可能にする
    }

}