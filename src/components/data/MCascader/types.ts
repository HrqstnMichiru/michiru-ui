import type { MPlacement } from "@/components/feedback/MTooltip/types";

export type MCascaderValue = string | number;
export type MCascaderModelValue = MCascaderValue | MCascaderValue[] | "";

export interface MCascaderOption {
    label: string;
    value: MCascaderValue;
    disabled?: boolean;
    children?: MCascaderOption[];
}

export interface MCascaderProps {
    disabled?: boolean;

    options?: MCascaderOption[];
    width?: number;
    placement?: MPlacement;
    placeholder?: string;
    clearable?: boolean;
    size?: "small" | "medium" | "large";
    borderAlways?: boolean;
    block?: boolean;
    prefixIcon?: string;
    maxHeight?: number;

    separator?: string;
    showAllLevels?: boolean; // 是否展示所有层级
    changeOnSelect?: boolean;
    emitPath?: boolean;
}

export interface MCascaderEmits {
    (e: "change"): void;
}
