import type { Placement } from "@/components";

export interface DatePickerProps {
    disabled?: boolean;

    width?: number;
    clearable?: boolean;
    placement?: Placement;
    size?: "small" | "medium" | "large";
    borderAlways?: boolean;
    block?: boolean;
    placeholder?: string;
    tooltipWidth?: number;
    maxCount?: number;
    hideAfterClick?: boolean;

    multiple?: boolean;
    format?: string;
}
export interface DatePickerEmits {
    (e: "change"): void;
}

export interface DatePickerPanelProps {
    multiple?: boolean;
    format?: string;
}
export interface DatePickerPanelEmits {
    (e: "change"): void;
    (e: "click"): void;
}
export interface DatePickerPanelInstance {
    clearSelection: () => void;
    resetPanel: () => void;
    deleteSelection: (index: number) => void;
}
