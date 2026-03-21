import type { ComponentInternalInstance, InjectionKey } from "vue";

// 传递给 MLoading 组件的 props 类型
export interface MLoadingProps {
    onDestroy: () => void;
    target?: string | HTMLElement;
    duration?: number; // 动画持续时间
}

// 外部访问 MLoading 实例的方法
export interface MLoadingInstance {
    destroy: () => void;
    vm?: ComponentInternalInstance;
}

export interface MLoadingProviderProps {
    duration?: number; // 动画持续时间
}
export interface MLoadingProviderContext {
    create: (target?: string | HTMLElement) => MLoadingInstance;
}
export const MLoadingProviderContextKey: InjectionKey<MLoadingProviderContext> = Symbol("MLoadingProviderContext");
