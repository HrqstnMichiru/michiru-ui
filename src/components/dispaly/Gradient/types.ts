export interface GradientProps {
    content?: string; // 文本内容
    colors?: string[]; // 渐变颜色数组
    direction?: "horizontal" | "vertical" | "diagonal"; // 渐变方向
    angle?: number; // 自定义渐变角度
}
