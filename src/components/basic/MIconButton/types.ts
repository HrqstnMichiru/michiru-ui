import type { MPlacement } from "@/components/feedback/MTooltip/types";

export type MIconButtonSize = "small" | "medium" | "large";

export interface MIconButtonProps {
    icon: string;
    size?: MIconButtonSize;
    color?: string;
    disabled?: boolean;
    circle?: boolean;
    tooltip?: string;
    placement?: MPlacement;
}

export interface MIconButtonEmits {
    (e: "click"): void;
}
