import type { ComponentInternalInstance, InjectionKey } from "vue";

export type MMessageVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";
export interface MMessageProps {
    message: string; // 消息内容
    duration?: number; // 消息显示时间，单位毫秒
    showClose?: boolean; // 是否显示关闭按钮
    variant?: MMessageVariant; // 消息变体
    offset?: number; // 消息距离顶部的偏移量，单位px
    id: string; // 消息唯一标识符
    zIndex: number; // 消息的 z-index 值
    onDestroy: () => void; // 消息销毁回调函数
}
export type MMessageOptions = Omit<MMessageProps, "onDestroy" | "id" | "zIndex">;
export interface MMessageInstance {
    id: string;
    vm: ComponentInternalInstance;
    destroy: () => void;
}

export type _MMessageOptions = Omit<MMessageOptions, "offset">;
export type _MMessageInstance = Omit<MMessageProps, "offset">;
export interface MMessageProviderProps {
    duration?: number; // 默认显示时间，单位毫秒
    maxCount?: number; // 最大显示数量
    offset?: number; // 消息距离顶部的偏移量，单位px
    gap?: number; // 消息之间的间距，单位px
    zIndex?: number; // 消息的z-index起始值
}
export interface MMessageProviderContext {
    create: (options: _MMessageOptions) => _MMessageInstance;
    primary: (message: string, options?: Omit<_MMessageOptions, "message" | "variant">) => _MMessageInstance;
    success: (message: string, options?: Omit<_MMessageOptions, "message" | "variant">) => _MMessageInstance;
    warning: (message: string, options?: Omit<_MMessageOptions, "message" | "variant">) => _MMessageInstance;
    info: (message: string, options?: Omit<_MMessageOptions, "message" | "variant">) => _MMessageInstance;
    danger: (message: string, options?: Omit<_MMessageOptions, "message" | "variant">) => _MMessageInstance;
    purple: (message: string, options?: Omit<_MMessageOptions, "message" | "variant">) => _MMessageInstance;
    pink: (message: string, options?: Omit<_MMessageOptions, "message" | "variant">) => _MMessageInstance;
    destroyAll: () => void;
}
export const MMessageProviderContextKey: InjectionKey<MMessageProviderContext> = Symbol("MMessageProviderContext");
