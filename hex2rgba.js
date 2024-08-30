export default function hex2rgba(hex, opacity) {
    // 16進数の形式を正規化（#記号を取り除く）
    hex = hex.replace(/^#/, '');

    // 3桁の16進数を6桁に拡張（#RGB -> #RRGGBB）
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // 16進数を整数に変換
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // RGBA形式の文字列を返す
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}