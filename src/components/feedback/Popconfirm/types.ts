import type { TooltipEmits, TooltipInstance, TooltipProps } from "@/components/feedback/Tooltip/types";

export type PopconfirmVariant = "success" | "warning" | "danger" | "primary" | "info";
export interface PopconfirmProps extends Omit<TooltipProps, "theme"> {
    variant?: PopconfirmVariant;
    title?: string;
    message?: string;
    positiveText?: string;
    negativeText?: string;
    loading?: boolean;    showCancel?: boolean;
    showIcon?: boolean;
    positiveIcon?: string;
    negativeIcon?: string;
    onPositiveClick?: () => Promise<boolean>;
    onNegativeClick?: () => void;
}
export type PopconfirmEmits = TooltipEmits;
export type PopconfirmInstance = TooltipInstance;
