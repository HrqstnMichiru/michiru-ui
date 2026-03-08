import type { InjectionKey } from "vue";

export interface MTimelineItemProps {
    color?: "primary" | "success" | "warning" | "danger" | "info" | string; // 时间轴项目的颜色
    timestamp?: string; // 时间戳
    disabled?: boolean; // 是否禁用
    hollow?: boolean; // 是否空心点
    block?: boolean; // 是否为块级元素
}

export interface MTimelineProps {
    mode?: "left" | "alternate"; // 时间轴模式
    timestampPosition?: "top" | "bottom"; // 时间戳位置
}

export interface MTimelineContext {
    mode: "left" | "alternate";
    timestampPosition: "top" | "bottom";
}

export const MTimelineContextKey: InjectionKey<MTimelineContext> = Symbol("MTimelineContextKey");
