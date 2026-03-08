import { inject } from "vue";
import type { MLoadingProviderContext } from "./types";
import { MLoadingProviderContextKey } from "./types";

export const useLoading = (): MLoadingProviderContext => {
    const context = inject<MLoadingProviderContext>(MLoadingProviderContextKey);
    if (!context) {
        throw new Error("useLoading 只能在 LoadingProvider 组件内使用");
    }
    return context;
};
