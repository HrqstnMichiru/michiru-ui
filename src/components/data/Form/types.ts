import type { InjectionKey } from "vue";

interface Required {
    type: "required";
    message: string;
}

interface Length {
    type: "length";
    min?: number;
    max?: number;
    message: string;
}

interface Pattern {
    type: "pattern";
    pattern: RegExp;
    message: string;
}

interface Range {
    type: "range";
    min?: number;
    max?: number;
    message: string;
}

interface Validator {
    type: "validator";
    validator: () => Promise<boolean>;
    message: string;
}

type FormRule = Required | Length | Pattern | Range | Validator;
export type FormRules = Record<string, FormRule[]>;

export interface FormProps {
    model: Record<string, number | string>;
    rules?: FormRules;
    vertical?: boolean;
}

export interface FormItemProps {
    label?: string; // 表单项标签
    prop?: string; // 表单项对应的字段名
    labelPosition?: "left" | "top"; // 标签位置
    labelAlign?: "left" | "right" | "center"; // 标签对齐方式
    labelWidth?: number; // 标签宽度，单位px
    trigger?: "blur" | "change" | "none"; // 校验触发方式
    size?: "small" | "medium" | "large"; // 表单项尺寸
    visibleMark?: boolean; // 是否显示校验标记
    block?: boolean; // 是否为块级元素
    gap?: number; // 标签与内容的间距
    aligns?: "flex-start" | "center" | "flex-end"; // 水平模式下标签与内容的对齐方式
    space?: boolean; // 是否在标签与内容之间使用空间分隔
}

export interface FormInstance {
    validateFields: () => Promise<boolean>;
    validateField: (prop: string) => void;
    resetFields: () => void;
    resetField: (prop: string) => void;
}

export interface FormContext {
    model: Record<string, any>;
    rules?: Record<string, FormRule[]>;
    registerValidator: (prop: string, validator: () => Promise<void>) => void;
    registerResetHandler: (prop: string, resetHandler: () => void) => void;
}

export interface FormItemContext {
    validate: () => Promise<void>;
    resetValidate: () => void;
    trigger?: "blur" | "change" | "none";
    prop?: string;
    size: "small" | "medium" | "large";
    block: boolean;
}

export const FormItemContextKey: InjectionKey<FormItemContext> = Symbol("FormItemContext");
export const FormContextKey: InjectionKey<FormContext> = Symbol("FormContext");
