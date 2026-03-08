import type { InjectionKey } from "vue";

export interface MLoadingProps {
    id: string;
    src?: string;
    to?: string | HTMLElement;
    theme?: "light" | "dark";
    zIndex: number;
    onDestroy: () => void;
}
export type MLoadingOptions = Omit<MLoadingProps, "id" | "zIndex" | "onDestroy">;
export type _MLoadingInstance = MLoadingProps;
export interface MLoadingInstance {
    id: string;
    destroy: () => void;
}

export interface MLoadingProviderProps {
    maxCount?: number;
    zIndex?: number; // 加载动画的起始 z-index 值
}
export interface MLoadingProviderContext {
    create: (options?: MLoadingOptions) => _MLoadingInstance;
    destroyAll: () => void;
}
export const MLoadingProviderContextKey: InjectionKey<MLoadingProviderContext> = Symbol("MLoadingProviderContext");
