export interface MDrawerProps {
    maskClosable?: boolean; //  是否点击遮罩层关闭抽屉
    zIndex?: number; // z-index值

    title?: string; // 抽屉标题
    width?: number; //  抽屉宽度
    height?: number; // 抽屉高度
    header?: boolean; // 是否显示头部
    footer?: boolean; // 是否显示底部
    closable?: boolean; // 是否显示关闭按钮
    positiveText?: string; // 确认按钮文本
    negativeText?: string; // 取消按钮文本
    positiveIcon?: string;
    negativeIcon?: string;
    center?: boolean; // 是否垂直居中显示
    scrollable?: boolean; // 是否启用滚动条
    showIcon?: boolean; // 是否显示图标
    contentStyle?: Record<string, string>;
    loading?: boolean; // 确认按钮加载状态
    placement?: "left" | "right" | "top" | "bottom"; // 抽屉出现的位置
    onPositiveClick?: () => Promise<boolean>; // 确认按钮点击事件
    onNegativeClick?: () => void; // 取消按钮点击事件
}

export interface MDrawerInstance {
    open: () => void; // 打开对话框
    close: () => void; // 关闭对话框
}

export interface MDrawerEmits {
    (e: "after-close"): void; // 关闭对话框时触发
}
