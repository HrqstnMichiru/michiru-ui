export enum MStatisticTrendType {
    UP = 0,
    DOWN = 1,
    FLAT = 2
}
export type MStatisticVariant = "primary" | "success" | "warning" | "danger" | "info";

export interface MStatisticProps {
    title?: string; // 标题
    value: number; // 数值
    prefix?: string; // 前缀
    suffix?: string; // 后缀
    precision?: number; // 小数位数
    icon?: string; // 图标
    variant?: MStatisticVariant; // 颜色变体
    duration?: number; // 动画持续时间，单位为毫秒
    trendType: MStatisticTrendType; // 趋势类型
    trendValue?: string | number; // 趋势数值
    trendPrefix?: string; // 趋势前缀
}
export interface MStatisticEmits {
    (event: "animation-end"): void;
}
