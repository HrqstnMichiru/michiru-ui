export interface MProgressProps {
    percentage: number; // 进度百分比
    type?: "line" | "circle"; // 进度条类型
    strokeWidth?: number; // 进度条的宽度，单位px
    width?: number; // 环形进度条画布宽度，单位px
    showText?: boolean; // 是否显示进度数值或状态图标
    color?: string; // 进度条颜色，会覆盖 variant 属性
    variant?: "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray"; // 进度条主题色彩变体
    format?: (percentage: number) => string; // 指定进度条文字内容
    backgroundColor?: string; // 进度条背景色
    animate?: boolean; // 是否启用动画效果
    textColor?: string; // 进度条文字颜色
}
