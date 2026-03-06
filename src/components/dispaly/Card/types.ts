export type CardIconVariant = "gray" | "primary" | "success" | "warning" | "error" | "info" | "purple" | "pink";

export interface CardProps {
    contentStyle?: Record<string, string>; // 内容区域的自定义样式
    headerStyle?: Record<string, string>; // 标题区域的自定义样式
    footerStyle?: Record<string, string>; // 底部区域的自定义样式
    blurable?: boolean; // 是否启用模糊效果
    shadow?: "always" | "hover" | "never"; // 卡片阴影效果
    center?: boolean; // 内容是否居中
    title?: string; // 卡片标题
    icon?: string; // 卡片标题图标
    iconVariant?: CardIconVariant; // 卡片标题icon的样式变体
    iconColor?: string; // 卡片标题icon的颜色
    action?: string; // 卡片标题操作区域内容
}

export interface CardEmits {
    (event: "action-click"): void; // 点击标题操作区域时触发的事件
}
