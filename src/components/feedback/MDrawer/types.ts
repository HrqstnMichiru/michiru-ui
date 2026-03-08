export interface MDrawerProps {
    title?: string; // 抽屉标题
    width?: number; //  抽屉宽度
    height?: number; // 抽屉高度
    maskClosable?: boolean; //  是否点击遮罩层关闭抽屉
    confirmText?: string; // 确认按钮文字
    cancelText?: string; // 取消按钮文字
    maskTheme?: "light" | "dark" | "no-mask"; // 主题变体
    zIndex?: number; // z-index值
    footer?: boolean; // 是否显示底部操作栏
    placement?: "left" | "right" | "top" | "bottom"; // 抽屉出现的位置
    confirm?: () => Promise<boolean>; // 确认回调函数
}

export interface MDrawerInstance {
    open: () => void; // 打开对话框
    close: () => void; // 关闭对话框
    delayedClose: () => void; // 延时关闭对话框
}

export interface MDrawerEmits {
    (event: "after-close", confirm: boolean): void; // 关闭对话框时触发
}
