import type { Placement } from "@/components/feedback";
import type { InjectionKey } from "vue";

export interface SelectOptionProps {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface SelectProps {
    disabled?: boolean;

    width?: number;
    placement?: Placement;
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

export interface SelectEmits {
    (e: "change"): void;
}

export interface SelectContext {
    setModelValue: (label: string, value: string | number, initila: boolean) => void;
    isSelected: (value: string | number) => boolean;
    register: (label: string, value: string | number) => void;
}

export const SelectContextKey: InjectionKey<SelectContext> = Symbol("SelectContextKey");
