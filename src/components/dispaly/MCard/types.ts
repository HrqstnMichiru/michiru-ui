export type MCardIconVariant = "gray" | "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";

export interface MCardProps {
    contentStyle?: Record<string, string>; // 内容区域的自定义样式
    headerStyle?: Record<string, string>; // 标题区域的自定义样式
    footerStyle?: Record<string, string>; // 底部区域的自定义样式
    shadow?: "always" | "hover" | "never"; // 卡片阴影效果
    center?: boolean; // 内容是否居中
    title?: string; // 卡片标题
    icon?: string; // 卡片标题图标
    variant?: MCardIconVariant; // 卡片标题icon的样式变体
}

export interface MCardEmits {
    (event: "action-click"): void; // 点击标题操作区域时触发的事件
}
