import type { InjectionKey, Slots } from "vue";

export type MTableSize = "small" | "medium" | "large"; // 表格尺寸，small表示小尺寸，medium表示中等尺寸，large表示大尺寸
export type MTableAlign = "left" | "center" | "right"; // 对齐方式，left表示左对齐，center表示居中对齐，right表示右对齐
export type MTableFixed = boolean | "left" | "right"; // 固定列，true表示固定在左侧，false表示不固定，"left"和"right"分别表示固定在左侧和右侧
export type MTableColType = "default" | "index" | "selection"; // 列类型，default表示普通列，index表示序号列，selection表示选择列

export interface MTableColProps {
    prop?: string; // 列字段
    label?: string; // 列标题
    width?: number; // 列宽度
    minWidth?: number; // 最小宽度
    aligns?: MTableAlign; // 对齐方式
    fixed?: MTableFixed; // 固定列
    type?: MTableColType; // 列类型
}

export interface MTableColumnConfig extends MTableColProps {
    slots?: Slots;
}

export interface MResolvedColumn extends MTableColumnConfig {
    key: symbol | string;
}

export interface MRenderColumn extends MResolvedColumn {
    fixedSide?: "left" | "right";
    trackWidth: string;
    stickyOffset?: string;
}

export interface MTableContext {
    registerColumn: (column: MTableColumnConfig) => symbol;
    updateColumn: (key: symbol, column: MTableColumnConfig) => void;
    unregisterColumn: (key: symbol) => void;
}

export const MTableContextKey: InjectionKey<MTableContext> = Symbol("MTableContextKey");

export interface MTableProps<T extends Record<string, any>> {
    striped?: boolean; // 斑马纹
    bordered?: boolean; // 边框
    data: T[]; // 表格数据
    hoverable?: boolean; // 悬停高亮
    size?: MTableSize; // 尺寸
    rowKey: keyof T; // 行唯一标识字段，必须是T的键
    height?: number; // 表格滚动区域高度
    maxHeight?: number; // 表格滚动区域最大高度
}

export interface MTableEmits<T extends Record<string, any>> {
    (e: "row-click", row: T): void; // 行点击事件
    (e: "row-select", row: T): void; // 行选择事件
    (e: "selection-change", selectedRows: T[]): void; // 选择行变化事件
}

export interface MTableInstance<T extends Record<string, any>> {
    getSelectedRows: () => T[]; // 获取已选择的行
    selectionSize: number; // 已选择行的数量
    toggleRowSelected: (row: T) => void; // 切换行选择状态
    clearSelection: () => void; // 清空选择
}
