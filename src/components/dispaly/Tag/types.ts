export type TagSize = "small" | "medium" | "large";

export type TagVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";

export type TagShape = "rounded" | "circle" | "square";

export interface TagProps {
    text?: string; // 标签文本
    size?: TagSize; // 标签大小
    variant?: TagVariant; // 标签类型/颜色
    shape?: TagShape; // 标签形状
    closable?: boolean; // 是否可关闭
    outlined?: boolean; // 是否为轮廓样式
    plain?: boolean; // 是否为朴素样式
    icon?: string; // 图标名称
    autoClose?: boolean; // 是否自动关闭标签
}

export interface TagEmits {
    (e: "close"): void; // 关闭标签时触发
}
