export type NumberAnimationEasing = "linear" | "easeOutCubic" | "easeOutQuad" | "easeInOutCubic";

export interface NumberAnimationProps {
    value: number; // 目标值
    from?: number; // 起始值
    duration?: number; // 动画时长(ms)
    decimals?: number; // 小数位数
    prefix?: string; // 前缀
    suffix?: string; // 后缀
    easing?: NumberAnimationEasing; // 缓动函数
    autoplay?: boolean; // 是否自动播放
    useGrouping?: boolean; // 是否使用千分位分隔符
}

export interface NumberAnimationEmits {
    (event: "finish"): void;
}

export interface NumberAnimationInstance {
    start: () => void;
    stop: () => void;
}
