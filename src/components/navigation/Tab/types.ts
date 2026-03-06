import type { InjectionKey } from "vue";

export interface TabProps {
    variant?: "line" | "card" | "box" | "segmented" | "bar"; // 选项卡样式风格
    position?: "top" | "bottom" | "left" | "right"; // 选项卡位置
    router?: boolean; // 是否启用路由模式
    disabled?: boolean; // 是否禁用整个选项卡组件
    closable?: boolean; // 是否可关闭选项卡
    addable?: boolean; // 是否可添加选项卡
    defaultActive?: number | string; // 默认激活的选项卡索引或路由路径
    gap?: number; // 导航栏与内容之间的间距
    width?: number | string; // 选项卡导航栏宽度, 仅 position 为 left 或 right 时有效
    gutter?: number | string; // 选项卡面板之间的间距
}

export interface TabEmits {
    (e: "change"): void; // 选项卡切换时触发
}

export interface TabPanelProps {
    label?: string; // 选项卡标签
    name: number | string; // 选项卡唯一标识
    icon?: string; // 图标
    disabled?: boolean; // 是否禁用该选项卡
    fixed?: boolean;
}

export interface TabContext {
    register: (item: TabPanelProps) => void;
    isActive: (name: string | number) => boolean;
    switchDirection: "left" | "right";
    router: boolean;
}
export const TabContextKey: InjectionKey<TabContext> = Symbol("TabContextKey");

export interface TabInstance {
    addTab: (item: TabPanelProps) => void;
    switchDirection: "left" | "right";
}
