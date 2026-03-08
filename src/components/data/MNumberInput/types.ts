export interface MNumberInputProps {
    width?: number; // 输入框宽度
    size?: "small" | "medium" | "large"; // 输入框尺寸
    disabled?: boolean; // 是否禁用
    readonly?: boolean; // 是否只读
    block?: boolean; // 是否为块级元素
    borderAlways?: boolean; // 是否一直显示边框
    min?: number; // 最小值
    max?: number; // 最大值
    step?: number; // 步长
    precision?: number; // 精度
    prefixText?: string; // 前缀文本
    suffixText?: string; // 后缀文本
    useGrouping?: boolean; // 是否使用千分位分隔符
}

export interface MNumberInputEmits {
    (e: "focus"): void; // 输入框获得焦点时触发
    (e: "blur"): void; // 输入框失去焦点时触发
    (e: "change"): void; // 输入框内容变化时触发
    (e: "input", value: number | undefined): void; // 输入框内容被输入时触发
}
