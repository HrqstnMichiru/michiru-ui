import type { InjectionKey, Reactive } from "vue";

export type MDialogVariant = "success" | "warning" | "danger" | "primary" | "info";
export interface MDialogProps {
    maskClosable?: boolean; // 是否可以点击遮罩层关闭
    zIndex?: number; // z-index值

    id: string; // 对话框唯一标识
    variant?: MDialogVariant; // 消息框变体
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
export type MDialogOptions = Omit<MDialogProps, "onDestroy" | "zIndex" | "loading" | "id">;
export type MDialogInstance = MDialogProps;

export interface MDialogProviderProps {
    width?: number; // 对话框宽度
    maskClosable?: boolean; // 是否允许点击遮罩关闭对话框
    maxCount?: number; // 最大显示数量
}
export interface MDialogProviderContext {
    create(options: MDialogOptions): Reactive<MDialogInstance>;
    danger(message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<MDialogInstance>;
    primary(message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<MDialogInstance>;
    success(message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<MDialogInstance>;
    warning(message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<MDialogInstance>;
    destroyAll(): void;
    info(message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "showCancel" | "variant" | "loading">): Reactive<MDialogInstance>;
    alert(message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "showCancel" | "loading">): Reactive<MDialogInstance>;
    confirm(message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "showCancel" | "loading">): Reactive<MDialogInstance>;
}
export const MDialogProviderContextKey: InjectionKey<MDialogProviderContext> = Symbol("MDialogProviderContext");
