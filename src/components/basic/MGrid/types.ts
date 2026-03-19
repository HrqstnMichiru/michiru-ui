import type { InjectionKey } from "vue";

export interface MGridProps {
    cols?: number; // 列数
    gap?: number | [number, number]; // 网格间距，如果是数组则表示[水平间距, 垂直间距]
    aligns?: "start" | "center" | "end" | "stretch" | "baseline"; // 子元素在格子内的对齐方式
    minWidth?: number; // 自动布局模式下，单项最小宽度
    maxWidth?: number; // 自动布局模式下，单项最大宽度
}
export interface MGridContext {
    register: (span: number, offset: number) => number;
    autoLayout: boolean;
}
export const MGridContextKey: InjectionKey<MGridContext> = Symbol("MGridContextKey");

export interface MGridItemProps {
    span?: number; // 占位格数
    offset?: number; // 偏移格数
}
