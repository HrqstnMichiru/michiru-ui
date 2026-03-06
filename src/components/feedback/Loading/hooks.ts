import { inject } from "vue";
import type { LoadingProviderContext } from "./types";
import { LoadingProviderContextKey } from "./types";

export const useLoading = (): LoadingProviderContext => {
    const context = inject<LoadingProviderContext>(LoadingProviderContextKey);
    if (!context) {
        throw new Error("useLoading 只能在 LoadingProvider 组件内使用");
    }
    return context;
};
