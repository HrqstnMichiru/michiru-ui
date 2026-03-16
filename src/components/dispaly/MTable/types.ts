import type { InjectionKey, Slot } from "vue";
import type { MPlacement } from "@/components/feedback/MTooltip/types";

export type MTableSize = "small" | "medium" | "large";
export type MTableAlign = "left" | "center" | "right";
export type MTableFixed = boolean | "left" | "right";
export type MTableColType = "default" | "index" | "selection";

export interface MTableColProps {
    prop?: string;
    label?: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    aligns?: MTableAlign;
    fixed?: MTableFixed;
    type?: MTableColType;
    tooltip?: boolean;
    maxLines?: number;
    placement?: MPlacement;
}

export interface MTableHeaderSlotScope {
    column: MTableColumnConfig;
}

export interface MTableDefaultSlotScope<T extends Record<string, any> = Record<string, any>> {
    row: T;
    index: number;
    column: MTableColumnConfig;
}

export interface MTableColSlots<T extends Record<string, any> = Record<string, any>> {
    default?: (props: MTableDefaultSlotScope<T>) => any;
    header?: (props: MTableHeaderSlotScope) => any;
}

export interface MTableColumnSlots {
    default?: Slot<MTableDefaultSlotScope>;
    header?: Slot<MTableHeaderSlotScope>;
}

export interface MTableColumnConfig extends MTableColProps {
    slots?: MTableColumnSlots;
}

export interface MResolvedColumn extends MTableColumnConfig {
    key: symbol;
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
    striped?: boolean;
    bordered?: boolean;
    data: T[];
    loading?: boolean;
    hoverable?: boolean;
    size?: MTableSize;
    rowKey: keyof T;
    height?: number;
    maxHeight?: number;
}

export interface MTableEmits<T extends Record<string, any>> {
    (e: "row-click", row: T): void;
    (e: "row-select", row: T): void;
    (e: "selection-change", selectedRows: T[]): void;
}

export interface MTableInstance<T extends Record<string, any>> {
    getSelectedRows: () => T[];
    selectionSize: number;
    toggleRowSelected: (row: T) => void;
    clearSelection: () => void;
}
