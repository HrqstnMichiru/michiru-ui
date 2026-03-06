import type { CardEmits, CardProps } from "@/components/dispaly/Card/types";
import type { TooltipEmits, TooltipInstance, TooltipProps } from "@/components/feedback/Tooltip/types";

export interface PopoverProps extends Omit<TooltipProps, "theme">, Omit<CardProps, "blurable" | "shadow"> {}
export interface PopoverEmits extends TooltipEmits, CardEmits {}
export type PopoverInstance = TooltipInstance;
