import type { ComponentInternalInstance, InjectionKey } from "vue";

export type MNotificationVariant = "primary" | "success" | "warning" | "danger" | "info" | "pink" | "purple";
export type MNotificationPlacement = "top-right" | "top-left" | "bottom-right" | "bottom-left";
export interface MNotificationProps {
    message: string; // 通知内容
    title?: string; // 通知标题
    variant?: MNotificationVariant; // 通知类型
    duration?: number; // 显示时长，单位毫秒，0 表示不自动关闭
    showClose?: boolean; // 是否显示关闭按钮
    showIcon?: boolean; // 是否显示图标
    offset?: number | Array<number>; // 距离边缘的距离，单位px
    placement?: MNotificationPlacement; // 通知位置
    id: string; // 通知唯一标识符
    zIndex: number; // z-index 值
    onDestroy: () => void; // 销毁回调函数
}
export type MNotificationOptions = Omit<MNotificationProps, "onDestroy" | "id" | "zIndex">;
export interface MNotificationInstance {
    id: string;
    vm: ComponentInternalInstance;
    destroy: () => void;
}

export type _MNotificationOptions = Omit<MNotificationOptions, "offset">;
export type _MNotificationInstance = Omit<MNotificationProps, "offset">;
export interface MNotificationProviderProps {
    duration?: number; // 默认显示时间，单位毫秒
    maxCount?: number; // 最大显示数量
    offset?: number | Array<number>; // 通知距离边缘的距离，单位px
    gap?: number; // 消息之间的间距，单位px
    zIndex?: number; // 消息的z-index起始值
}
export interface MNotificationProviderContext {
    create: (options: _MNotificationOptions) => _MNotificationInstance;
    primary: (message: string, options?: Omit<_MNotificationOptions, "message" | "variant">) => _MNotificationInstance;
    success: (message: string, options?: Omit<_MNotificationOptions, "message" | "variant">) => _MNotificationInstance;
    warning: (message: string, options?: Omit<_MNotificationOptions, "message" | "variant">) => _MNotificationInstance;
    info: (message: string, options?: Omit<_MNotificationOptions, "message" | "variant">) => _MNotificationInstance;
    danger: (message: string, options?: Omit<_MNotificationOptions, "message" | "variant">) => _MNotificationInstance;
    destroyAll: () => void;
}
export const MNotificationProviderContextKey: InjectionKey<MNotificationProviderContext> = Symbol("MNotificationProviderContext");
