import type { InjectionKey } from "vue";

export interface GridProps {
    cols?: number; // 列数
    gap?: number | [number, number]; // 网格间距，如果是数组则表示[水平间距, 垂直间距]
    aligns?: "start" | "center" | "end" | "stretch" | "baseline"; // 子元素在格子内的对齐方式
}
export interface GridContext {
    register: (span: number, offset: number) => number;
}
export const GridContextKey: InjectionKey<GridContext> = Symbol("GridContextKey");

export interface GridItemProps {
    span?: number; // 占位格数
    offset?: number; // 偏移格数
}
