export type AlertVariant = "primary" | "success" | "warning" | "danger" | "info";

export interface AlertProps {
    variant?: AlertVariant; // 警告类型
    title?: string; // 警告标题
    message?: string; // 警告描述
    showIcon?: boolean; // 是否显示图标
    closable?: boolean; // 是否显示关闭按钮
    effect?: "light" | "dark"; // 样式效果
    noTitle?: boolean; // 是否隐藏标题
}

export interface AlertEmits {
    (e: "after-close"): void; // 关闭时触发的事件
}
