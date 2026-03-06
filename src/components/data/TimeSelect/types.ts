import type { VirtualSelectProps } from "../VirtualSelect";

export interface TimeSelectProps extends Omit<VirtualSelectProps, "dataSource" | "multiple" | "hasSelectAll" | "tooltipMaxCount" | "tooltipWidth" | "prefixIcon"> {
    format?: string;
    step?: number;
    min?: string | number;
    max?: string | number;
    type?: "time" | "year" | "month" | "week";
}

export interface TimeSelectEmits {
    (e: "change"): void;
}
