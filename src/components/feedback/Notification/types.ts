import type { ComponentInternalInstance, InjectionKey } from "vue";

export type NotificationVariant = "primary" | "success" | "warning" | "danger" | "info";
export type NotificationPlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";
export interface NotificationProps {
    message: string; // 通知内容
    title?: string; // 通知标题
    variant?: NotificationVariant; // 通知类型
    duration?: number; // 显示时长，单位毫秒，0 表示不自动关闭
    showClose?: boolean; // 是否显示关闭按钮
    showIcon?: boolean; // 是否显示图标
    offset?: number | Array<number>; // 距离边缘的距离，单位px
    placement?: NotificationPlacement; // 通知位置
    id: string; // 通知唯一标识符
    zIndex: number; // z-index 值
    onDestroy: () => void; // 销毁回调函数
}
export type NotificationOptions = Omit<NotificationProps, "onDestroy" | "id" | "zIndex">;
export interface NotificationInstance {
    id: string;
    vm: ComponentInternalInstance;
    destroy: () => void;
}

export type _NotificationOptions = Omit<NotificationOptions, "offset">;
export type _NotificationInstance = Omit<NotificationProps, "offset">;
export interface NotificationProviderProps {
    duration?: number; // 默认显示时间，单位毫秒
    maxCount?: number; // 最大显示数量
    offset?: number | Array<number>; // 通知距离边缘的距离，单位px
    gap?: number; // 消息之间的间距，单位px
    zIndex?: number; // 消息的z-index起始值
}
export interface NotificationProviderContext {
    create: (options: _NotificationOptions) => _NotificationInstance;
    primary: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => _NotificationInstance;
    success: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => _NotificationInstance;
    warning: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => _NotificationInstance;
    info: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => _NotificationInstance;
    danger: (message: string, options?: Omit<_NotificationOptions, "message" | "variant">) => _NotificationInstance;
    destroyAll: () => void;
}
export const NotificationProviderContextKey: InjectionKey<NotificationProviderContext> = Symbol("NotificationProviderContext");
