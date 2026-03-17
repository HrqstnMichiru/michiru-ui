export interface MOverlayProps {
    maskClosable?: boolean; // 是否可以点击遮罩层关闭
    zIndex?: number; // z-index值
    center?: boolean; // 内容是否垂直居中
    top?: number; // 对话框距离顶部的距离
    transition?: "fade-translate" | "slide-down" | "none"; // 过渡动画类型
}
export interface MOverlayInstance {
    open: () => void; // 打开对话框
    close: () => void; // 关闭对话框
}
export interface MOverlayEmits {
    (e: "after-close"): void; // 关闭内层对话框时触发
}
