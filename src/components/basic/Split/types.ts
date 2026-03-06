export type SplitDirection = "horizontal" | "vertical";

export interface SplitProps {
    direction?: SplitDirection; // 分割方向
    size?: string; // 第一个面板初始尺寸，像素值或百分比
    min?: string; // 第一个面板最小尺寸，像素值或百分比
    max?: string; // 第一个面板最大尺寸，像素值或百分比
    disabled?: boolean; // 是否禁用拖动
}

export interface SplitEmits {
    (e: "dragStart", value: string): void;
    (e: "dragging", value: string): void;
    (e: "dragEnd", value: string): void;
}
