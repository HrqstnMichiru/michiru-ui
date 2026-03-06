export interface RatingProps {
    disabled?: boolean; // 是否禁用
    readonly?: boolean; // 是否只读
    color?: string; // 激活时的颜色
    clearable?: boolean; // 是否可清空
    rate?: number; // 当前评分值
}

export interface RatingEmits {
    (e: "change"): void;
}
