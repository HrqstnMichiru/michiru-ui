import type { MVirtualSelectProps } from "@/components/data/MVirtualSelect";

export interface MTimeSelectProps extends Omit<MVirtualSelectProps, "dataSource" | "multiple" | "hasSelectAll" | "tooltipMaxCount" | "tooltipWidth" | "prefixIcon"> {
    format?: string;
    step?: number;
    min?: string | number;
    max?: string | number;
    type?: "time" | "year" | "month" | "week";
}

export interface MTimeSelectEmits {
    (e: "change"): void;
}
