import type { InjectionKey } from "vue";

export interface LoadingProps {
    id: string;
    src?: string;
    to?: string | HTMLElement;
    theme?: "light" | "dark";
    zIndex: number;
    onDestroy: () => void;
}
export type LoadingOptions = Omit<LoadingProps, "id" | "zIndex" | "onDestroy">;
export type _LoadingInstance = LoadingProps;
export interface LoadingInstance {
    id: string;
    destroy: () => void;
}

export interface LoadingProviderProps {
    maxCount?: number;
    zIndex?: number; // 加载动画的起始 z-index 值
}
export interface LoadingProviderContext {
    create: (options?: LoadingOptions) => _LoadingInstance;
    destroyAll: () => void;
}
export const LoadingProviderContextKey: InjectionKey<LoadingProviderContext> = Symbol("LoadingProviderContext");
