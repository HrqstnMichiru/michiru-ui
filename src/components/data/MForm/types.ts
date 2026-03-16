import type { InjectionKey } from "vue";

interface Required {
    required: true;
    message: string;
}

interface Length {
    length?: number;
    minLength?: number;
    maxLength?: number;
    message: string;
}

interface Pattern {
    pattern: RegExp;
    message: string;
}

interface Range {
    min?: number;
    max?: number;
    message: string;
}

interface Validator {
    validator: () => Promise<boolean>;
    message: string;
}

type MFormRule = Required | Length | Pattern | Range | Validator;
export type MFormRules = Record<string, MFormRule[]>;
export type MFormModel = Record<string, number | string | Array<number | string>>;

export interface MFormProps {
    model: MFormModel;
    rules?: MFormRules;
    labelPosition?: "left" | "top"; // 标签位置
    labelAlign?: "left" | "right" | "center"; // 标签对齐方式
    labelWidth?: number; // 标签宽度，单位px
    size?: "small" | "medium" | "large"; // 表单项尺寸
}

export interface MFormItemProps {
    label?: string; // 表单项标签
    prop?: string; // 表单项对应的字段名
    labelPosition?: "left" | "top"; // 标签位置
    labelAlign?: "left" | "right" | "center"; // 标签对齐方式
    labelWidth?: number; // 标签宽度，单位px
    trigger?: "blur" | "change"; // 校验触发方式
    size?: "small" | "medium" | "large"; // 表单项尺寸
    block?: boolean; // 是否为块级元素
    required?: boolean; // 是否必填
    errorMessage?: string; // 错误提示信息
    hideRequiredAsterisk?: boolean; // 是否隐藏必填项的红色星号
    gap?: number; // 标签与内容的间距
    aligns?: "flex-start" | "center" | "flex-end"; // 水平模式下标签与内容的对齐方式
    space?: boolean; // 是否在标签与内容之间使用空间分隔
}

export interface MFormInstance {
    validateFields: () => Promise<boolean>;
    validateField: (prop: string) => Promise<boolean>;
    resetFields: () => void;
    resetField: (prop: string) => void;
}

export interface MFormContext {
    model: MFormModel;
    rules?: Record<string, MFormRule[]>;
    labelPosition: "left" | "top"; // 标签位置
    labelAlign: "left" | "right" | "center"; // 标签对齐方式
    labelWidth?: number; // 标签宽度，单位px
    size: "small" | "medium" | "large"; // 表单项尺寸
    registerValidator: (prop: string, validator: () => Promise<boolean>) => void;
    registerResetHandler: (prop: string, resetHandler: () => void) => void;
}

export interface MFormItemContext {
    validate: () => Promise<boolean>;
    resetValidate: () => void;
    trigger?: "blur" | "change" | "none";
    prop?: string;
    size: "small" | "medium" | "large";
    block: boolean;
}

export const MFormContextKey: InjectionKey<MFormContext> = Symbol("MFormContextKey");
export const MFormItemContextKey: InjectionKey<MFormItemContext> = Symbol("MFormItemContextKey");

export const FormItemContextKey: InjectionKey<MFormItemContext> = Symbol("MFormItemContext");
export const FormContextKey: InjectionKey<MFormContext> = Symbol("MFormContext");
