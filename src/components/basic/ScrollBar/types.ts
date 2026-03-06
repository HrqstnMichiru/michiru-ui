export interface ScrollBarProps {
    height?: number; // 滚动区域高度
    maxHeight?: number; // 滚动区域最大高度
    width?: number; // 滚动区域宽度
    maxWidth?: number; // 滚动区域最大宽度
    thumbColor?: string; // 滚动条滑块颜色
    scrollbar?: "auto" | "always" | "never"; // 滚动条显示方式
}
