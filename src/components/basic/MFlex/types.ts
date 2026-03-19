import type { InjectionKey } from "vue";

export interface MFlexProps {
    vertical?: boolean; // 是否垂直排列
    gap?: number | [number, number]; // 子元素间距，如果是数组则表示[水平间距, 垂直间距]
    aligns?: "start" | "center" | "end" | "stretch" | "baseline"; // 侧轴对齐方式
    justify?: "start" | "center" | "end" | "space-around" | "space-between"; // 主轴对齐方式
    wrap?: boolean; // 是否换行
    offset?: number; // 偏移栅格数（基于24栅格）
    inline?: boolean; // 是否为行内元素
    span?: number; // 占位栅格数（基于24栅格）
}

export interface MFlexContext {
    gapForSpan: number; // 根据span计算的gap值
}

export const MFlexContextKey: InjectionKey<MFlexContext> = Symbol("MFlexContextKey");
