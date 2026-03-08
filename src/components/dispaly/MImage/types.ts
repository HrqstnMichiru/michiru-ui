import type { InjectionKey } from "vue";

export interface MImageProps {
    src: string; // 图片源地址
    width?: number; // 图片宽度
    height?: number; // 图片高度
    position?: "left" | "center" | "right" | "top" | "bottom"; // 图片位置
    fit?: "fill" | "contain" | "cover" | "scale-down" | "none"; // 图片适应方式
    square?: boolean; // 方形图片
    circle?: boolean; // 圆形图片
    rounded?: boolean; // 胶囊图片
    errorSize?: "small" | "medium" | "large" | number; // 错误文字的大小
    showBorder?: boolean; // 是否显示边框
    previewDisabled?: boolean; // 是否禁用图片预览功能
    showToolbar?: boolean; // 是否在预览时显示工具栏
    showTooltip?: boolean; // 是否在工具栏按钮上显示工具提示
    urlFormat?: (url: string) => string; // 图片地址的格式化函数
}
export interface MImageInstance {
    previewImage(): void; // 打开图片预览
}

export interface MImageGalleryProps {
    list: string[]; // 图片列表
    width: number; // 图片宽度
    height: number; // 图片高度
    transition?: "fade" | "page" | "slide" | "rotate"; // 图片切换动画
    position?: "left" | "center" | "right" | "top" | "bottom"; // 图片位置
    fit?: "fill" | "contain" | "cover" | "scale-down" | "none"; // 图片适应方式
    showToolbar?: boolean; // 是否在预览时显示工具栏
    showTooltip?: boolean; // 是否在工具栏按钮上显示工具提示
    previewDisabled?: boolean; // 是否禁用图片预览功能
    urlFormat?: (url: string) => string; // 图片地址的格式化函数
    thumbnailFormat?: (url: string) => string; // 缩略图地址的格式化函数
    errorSize?: "small" | "medium" | "large" | number; // 错误文字的大小
}

export interface MImageGroupProps {
    position?: "left" | "center" | "right" | "top" | "bottom"; // 图片组位置
    fit?: "fill" | "contain" | "cover" | "scale-down" | "none"; // 图片组适应方式
    showToolbar?: boolean; // 是否在预览时显示工具栏
    showTooltip?: boolean; // 是否在工具栏按钮上显示工具提示
    urlFormat?: (url: string) => string; // 图片地址的格式化函数
}
export interface MImageGroupInstance {
    previewImage(index: number): void; // 根据索引打开图片预览
}
export interface MImageGroupContext {
    previewImage(index: number): void; // 根据索引打开图片预览
    position?: "left" | "center" | "right" | "top" | "bottom"; // 图片组位置
    fit?: "fill" | "contain" | "cover" | "scale-down" | "none"; // 图片组适应方式
    urlFormat?: (url: string) => string; // 图片地址的格式化函数
    register(src: string): number; // 注册图片并返回索引
}
export const MImageGroupContextKey: InjectionKey<MImageGroupContext> = Symbol("MImageGroupContext");

export interface MImagePreviewProps {
    showToolbar?: boolean; // 是否显示工具栏
    loop?: boolean; // 是否循环预览
    showTooltip?: boolean; // 是否显示工具提示
    list?: string[]; // 图片列表
    src?: string; // 图片源地址
    urlFormat?: (url: string) => string; // 图片地址的格式化函数
}
export interface MImagePreviewInstance {
    previewImage(index?: number): void; // 根据索引打开图片预览
}
