export type MStatisticTrendType = "up" | "down" | "unchanged";
export type MStatisticVariant = "primary" | "success" | "warning" | "danger" | "info";

export interface MStatisticProps {
    title?: string;
    value: number;
    prefix?: string;
    suffix?: string;
    precision?: number;
    icon?: string;
    variant?: MStatisticVariant;
    duration?: number;
    trendType: MStatisticTrendType;
    trendValue?: string | number;
    trendPrefix?: string;
}
export interface MStatisticEmits {
    (event: "animation-end"): void;
}
