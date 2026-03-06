import type { InjectionKey, Reactive } from "vue";

export type DialogVariant = "success" | "warning" | "danger" | "primary" | "info";
export interface DialogProps {
    maskClosable?: boolean; // 是否可以点击遮罩层关闭
    maskTheme?: "light" | "dark" | "no-mask"; // 主题变体
    zIndex?: number; // z-index值
    blurable?: boolean; // 是否启用背景模糊
    transition?: "fade-translate" | "slide-down" | "none"; // 过渡动画类型
    lock?: boolean; // 是否锁定背景滚动

    id: string; // 对话框唯一标识
    variant?: DialogVariant; // 消息框变体
    title?: string; // 标题
    message?: string; // 消息内容
    width?: number; // 对话框宽度
    closable?: boolean; // 对话框是否可关闭
    contentCenter?: boolean; // 内容是否居中
    positiveText?: string; // 确认按钮文本
    negativeText?: string; // 取消按钮文本
    loading?: boolean; // 确认按钮加载状态
    showCancel?: boolean; // 是否显示取消按钮
    positiveIcon?: string; // 确认按钮图标
    showIcon?: boolean; // 是否显示图标
    negativeIcon?: string; // 取消按钮图标
    onPositiveClick?: () => Promise<boolean>; // 确认回调函数
    onNegativeClick?: () => void; // 取消回调函数
    onDestroy: () => void; // 销毁回调函数
    onAfterClose?: () => void; // 关闭后回调函数
}
export type DialogOptions = Omit<DialogProps, "onDestroy" | "zIndex" | "loading" | "id">;
export type DialogInstance = DialogProps;

export interface DialogProviderProps {
    width?: number; // 对话框宽度
    maskClosable?: boolean; // 是否允许点击遮罩关闭对话框
    maxCount?: number; // 最大显示数量
}
export interface DialogProviderContext {
    create(options: DialogOptions): Reactive<DialogInstance>;
    danger(message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<DialogInstance>;
    primary(message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<DialogInstance>;
    success(message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<DialogInstance>;
    warning(message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<DialogInstance>;
    destroyAll(): void;
    info(message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<DialogInstance>;
    alert(message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "showCancel" | "loading">): Reactive<DialogInstance>;
    confirm(message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "showCancel" | "loading">): Reactive<DialogInstance>;
}
export const DialogProviderContextKey: InjectionKey<DialogProviderContext> = Symbol("DialogProviderContext");
