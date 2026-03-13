import type { MPlacement } from "@/components/feedback/MTooltip/types";

export interface MDatePickerProps {
    disabled?: boolean;

    width?: number;
    clearable?: boolean;
    placement?: MPlacement;
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
export interface MDatePickerEmits {
    (e: "change"): void;
}

export interface MDatePickerPanelProps {
    multiple?: boolean;
    format?: string;
}
export interface MDatePickerPanelEmits {
    (e: "change"): void;
    (e: "click"): void;
}
export interface MDatePickerPanelInstance {
    clearSelection: () => void;
    resetPanel: () => void;
    deleteSelection: (index: number) => void;
}
