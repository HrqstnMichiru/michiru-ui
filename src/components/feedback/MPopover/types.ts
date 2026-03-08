import type { MCardEmits, MCardProps } from "@/components/dispaly/MCard/types";
import type { MTooltipEmits, MTooltipInstance, MTooltipProps } from "@/components/feedback/MTooltip/types";

export interface MPopoverProps extends Omit<MTooltipProps, "theme">, Omit<MCardProps, "blurable" | "shadow"> {}
export interface MPopoverEmits extends MTooltipEmits, MCardEmits {}
export type MPopoverInstance = MTooltipInstance;
