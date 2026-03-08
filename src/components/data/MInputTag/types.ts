export interface MInputTagProps {
    width?: number; // 输入框宽度
    size?: "small" | "medium" | "large"; // 输入框尺寸
    disabled?: boolean; // 是否禁用
    readonly?: boolean; // 是否只读
    clearable?: boolean; // 是否可清除
    block?: boolean; // 是否为块级元素
    maxCount?: number; // 最大标签数量
    tooltipWidth?: number; // 提示框宽度
    placeholder?: string; // 输入框占位文本
}

export interface MInputTagEmits {
    (e: "focus"): void; // 输入框获得焦点时触发
    (e: "blur"): void; // 输入框失去焦点时触发
    (e: "change"): void; // 输入框内容变化时触发
}
