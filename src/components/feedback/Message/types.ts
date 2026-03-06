import type { ComponentInternalInstance, InjectionKey } from "vue";

export type MessageVariant = "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";
export interface MessageProps {
    message: string; // 消息内容
    duration?: number; // 消息显示时间，单位毫秒
    showClose?: boolean; // 是否显示关闭按钮
    variant?: MessageVariant; // 消息变体
    offset?: number; // 消息距离顶部的偏移量，单位px
    id: string; // 消息唯一标识符
    zIndex: number; // 消息的 z-index 值
    onDestroy: () => void; // 消息销毁回调函数
}
export type MessageOptions = Omit<MessageProps, "onDestroy" | "id" | "zIndex">;
export interface MessageInstance {
    id: string;
    vm: ComponentInternalInstance;
    destroy: () => void;
}

export type _MessageOptions = Omit<MessageOptions, "offset">;
export type _MessageInstance = Omit<MessageProps, "offset">;
export interface MessageProviderProps {
    duration?: number; // 默认显示时间，单位毫秒
    maxCount?: number; // 最大显示数量
    offset?: number; // 消息距离顶部的偏移量，单位px
    gap?: number; // 消息之间的间距，单位px
    zIndex?: number; // 消息的z-index起始值
}
export interface MessageProviderContext {
    create: (options: _MessageOptions) => _MessageInstance;
    primary: (message: string, options?: Omit<_MessageOptions, "message" | "variant">) => _MessageInstance;
    success: (message: string, options?: Omit<_MessageOptions, "message" | "variant">) => _MessageInstance;
    warning: (message: string, options?: Omit<_MessageOptions, "message" | "variant">) => _MessageInstance;
    info: (message: string, options?: Omit<_MessageOptions, "message" | "variant">) => _MessageInstance;
    danger: (message: string, options?: Omit<_MessageOptions, "message" | "variant">) => _MessageInstance;
    purple: (message: string, options?: Omit<_MessageOptions, "message" | "variant">) => _MessageInstance;
    pink: (message: string, options?: Omit<_MessageOptions, "message" | "variant">) => _MessageInstance;
    destroyAll: () => void;
}
export const MessageProviderContextKey: InjectionKey<MessageProviderContext> = Symbol("MessageProviderContext");
