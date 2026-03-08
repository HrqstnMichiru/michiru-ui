export interface MInputProps {
    width?: number; // 输入框宽度
    type?: "text" | "textarea"; // 输入框类型
    size?: "small" | "medium" | "large"; // 输入框尺寸
    placeholder?: string; // 占位符
    disabled?: boolean; // 是否禁用
    readonly?: boolean; // 是否只读
    clearable?: boolean; // 是否可清除
    showPassword?: boolean; // 是否显示切换密码可见按钮
    prefixIcon?: string; // 前缀图标名称
    suffixIcon?: string; // 后缀图标名称
    prefixText?: string; // 前缀文本
    suffixText?: string; // 后缀文本
    maxlength?: number; // 最大输入长度
    minlength?: number; // 最小输入长度
    rows?: number; // 多行输入框行数
    resizable?: boolean; // 多行输入框是否可调整大小
    showWordLimit?: boolean; // 是否显示字数统计
    block?: boolean; // 是否为块级元素
    borderAlways?: boolean; // 是否一直显示边框
    injected?: boolean; // 是否注入父组件的表单校验规则
    isEmpty?: boolean; // 是否为空的函数
}

export interface MInputEmits {
    (e: "focus"): void; // 输入框获得焦点时触发
    (e: "blur"): void; // 输入框失去焦点时触发
    (e: "clear"): void; // 清除按钮被点击时触发
    (e: "change"): void; // 输入框内容变化时触发
    (e: "input", value: string): void; // 输入框内容被输入时触发
}

export interface MInputInstance {
    focus: () => void;
    blur: () => void;
    ref: any;
}
