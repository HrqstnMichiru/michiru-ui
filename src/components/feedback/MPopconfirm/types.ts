import type { MTooltipEmits, MTooltipInstance, MTooltipProps } from "@/components/feedback/MTooltip/types";

export type MPopconfirmVariant = "success" | "warning" | "danger" | "primary" | "info";
export interface MPopconfirmProps extends Omit<MTooltipProps, "theme"> {
    variant?: MPopconfirmVariant;
    title?: string;
    message?: string;
    positiveText?: string;
    negativeText?: string;
    loading?: boolean;
    showCancel?: boolean;
    showIcon?: boolean;
    positiveIcon?: string;
    negativeIcon?: string;
    onPositiveClick?: () => Promise<boolean>;
    onNegativeClick?: () => void;
}
export type MPopconfirmEmits = MTooltipEmits;
export type MPopconfirmInstance = MTooltipInstance;
