import type { MPlacement } from "@/components/feedback/MTooltip/types";
import type { InjectionKey } from "vue";

export interface MOptionProps {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface MSelectProps {
    disabled?: boolean;

    width?: number;
    placement?: MPlacement;
    placeholder?: string;
    clearable?: boolean;
    size?: "small" | "medium" | "large";
    borderAlways?: boolean;
    block?: boolean;
    prefixIcon?: string;
    tooltipWidth?: number;
    maxCount?: number;
    multiple?: boolean;
    hasSelectAll?: boolean;

    maxHeight?: number;
    hideAfterClick?: boolean;
}

export interface MSelectEmits {
    (e: "change"): void;
}

export interface MSelectContext {
    setModelValue: (label: string, value: string | number, initila: boolean) => void;
    isSelected: (value: string | number) => boolean;
    register: (label: string, value: string | number) => void;
}

export const MSelectContextKey: InjectionKey<MSelectContext> = Symbol("MSelectContextKey");
