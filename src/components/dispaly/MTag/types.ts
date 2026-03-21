export type MTagSize = "small" | "medium" | "large";
export type MTagVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink" | "gray";

export interface MTagProps {
    text?: string; // 标签文本
    size?: MTagSize; // 标签大小
    variant?: MTagVariant; // 标签类型/颜色
    rounded?: boolean; // 是否为圆角标签
    borderless?: boolean; // 是否无边框
    closable?: boolean; // 是否可关闭
    outlined?: boolean; // 是否为轮廓样式
    plain?: boolean; // 是否为 Plain 样式
    icon?: string; // 图标名称
}

export interface MTagEmits {
    (e: "close"): void; // 关闭标签时触发
}
