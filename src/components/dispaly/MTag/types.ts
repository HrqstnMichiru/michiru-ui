export type MTagSize = "small" | "medium" | "large";

export type MTagVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";

export type MTagShape = "rounded" | "circle" | "square";

export interface MTagProps {
    text?: string; // 标签文本
    size?: MTagSize; // 标签大小
    variant?: MTagVariant; // 标签类型/颜色
    shape?: MTagShape; // 标签形状
    closable?: boolean; // 是否可关闭
    outlined?: boolean; // 是否为轮廓样式
    plain?: boolean; // 是否为 Plain 样式
    icon?: string; // 图标名称
    autoClose?: boolean; // 是否自动关闭标签
}

export interface MTagEmits {
    (e: "close"): void; // 关闭标签时触发
}
