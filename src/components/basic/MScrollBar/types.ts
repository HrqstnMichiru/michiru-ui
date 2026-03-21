export interface MScrollBarProps {
    height?: number; // 滚动区域高度
    maxHeight?: number; // 滚动区域最大高度
    width?: number; // 滚动区域宽度
    maxWidth?: number; // 滚动区域最大宽度
    scrollbar?: "always" | "never"; // 滚动条显示方式
    overflowX?: "hidden" | "scroll"; // 水平滚动条显示方式
    overflowY?: "hidden" | "scroll"; // 垂直滚动条显示方式
}
