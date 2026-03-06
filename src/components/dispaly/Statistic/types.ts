export type StatisticTrendType = "up" | "down" | "unchanged";
export type StatisticVariant = "primary" | "success" | "warning" | "danger" | "info";

export interface StatisticProps {
    title?: string;
    value: number;
    prefix?: string;
    suffix?: string;
    precision?: number;
    icon?: string;
    variant?: StatisticVariant;
    duration?: number;
    trendType: StatisticTrendType;
    trendValue?: string | number;
    trendPrefix?: string;
}
export interface StatisticEmits {
    (event: "animation-end"): void;
}
