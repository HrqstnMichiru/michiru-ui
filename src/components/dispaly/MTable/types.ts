import type { InjectionKey, Slot } from "vue";

export type MTableSize = "small" | "medium" | "large";
export type MTableAlign = "left" | "center" | "right";
export type MTableFixed = boolean | "left" | "right";

// 列组件的props属性
export interface MTableColProps {
    prop?: string;
    label?: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    aligns?: MTableAlign;
    fixed?: MTableFixed;
    tooltip?: boolean;
    maxLines?: number;
    [key: string]: any; // 其他属性
}
export type MTableColOption = MTableColProps;

// 列组件的作用域插槽数据类型
export interface MTableSlotScope<T extends Record<string, any> = Record<string, any>> {
    row?: T;
    index?: number;
    column?: MTableColProps;
}

export interface MTableColSlots<T extends Record<string, any> = Record<string, any>> {
    default?: (props: MTableSlotScope<T>) => any;
    header?: (props: MTableSlotScope<T>) => any;
}

export interface MTableColumnSlots<T extends Record<string, any> = Record<string, any>> {
    default?: Slot<MTableSlotScope<T>>;
    header?: Slot<MTableSlotScope<T>>;
}

// 注册列组件时传入的列配置对象
export interface MTableColumnConfig<T extends Record<string, any> = Record<string, any>> extends MTableColProps {
    slots?: MTableColumnSlots<T>;
}

// 解析后的列对象，包含一个唯一的key属性
export interface MResolvedColumn<T extends Record<string, any> = Record<string, any>> extends MTableColumnConfig<T> {
    key: symbol;
}

// 用于渲染的列对象，包含一些额外的属性
export interface MRenderColumn<T extends Record<string, any> = Record<string, any>> extends MResolvedColumn<T> {
    fixedSide?: "left" | "right"; // 固定列的固定边
    trackWidth: string; // 用于设置列宽的字符串
    stickyOffset?: string; // 用于实现粘性定位的偏移量
}

export interface MTableContext<T extends Record<string, any> = Record<string, any>> {
    registerColumn: (column: MTableColumnConfig<T>) => symbol;
    updateColumn: (key: symbol, column: MTableColumnConfig<T>) => void;
    unregisterColumn: (key: symbol) => void;
}

export const MTableContextKey: InjectionKey<MTableContext> = Symbol("MTableContextKey");

export interface MTableProps<T extends Record<string, any> = Record<string, any>> {
    striped?: boolean;
    bordered?: boolean;
    data: T[];
    loading?: boolean;
    hoverable?: boolean;
    size?: MTableSize;
    showCheckbox?: boolean;
    showIndex?: boolean;
    multiple?: boolean;
    rowKey: keyof T;
    height?: number;
    highlightCurrentRow?: boolean; // 是否高亮当前行
    clickWithSelect?: boolean; // 点击行时是否选中该行
}

export interface MTableEmits<T extends Record<string, any> = Record<string, any>> {
    (e: "row-click", row: T): void; // 行点击事件
    (e: "row-select", row: T): void; // 行选择事件
    (e: "selection-change", selectedRows: T[]): void; // 选择变化事件
}

export interface MTableInstance<T extends Record<string, any> = Record<string, any>> {
    getSelectedRows: () => T[];
    selectionSize: number;
    toggleRowSelected: (row: T) => void;
    clearSelection: () => void;
}
