export interface OverlayProps {
    maskClosable?: boolean; // 是否可以点击遮罩层关闭
    maskTheme?: "light" | "dark" | "no-mask"; // 主题变体
    zIndex?: number; // z-index值
    center?: boolean; // 内容是否垂直居中
    top?: number; // 对话框距离顶部的距离
    blurable?: boolean; // 是否启用背景模糊
    transition?: "fade-translate" | "slide-down" | "none"; // 过渡动画类型
    lock?: boolean; // 是否锁定背景滚动
}
export interface OverlayInstance {
    open: () => void; // 打开对话框
    close: () => void; // 关闭对话框
}
export interface OverlayEmits {
    (event: "after-close"): void; // 关闭内层对话框时触发
}
