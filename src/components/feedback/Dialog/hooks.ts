import { inject } from "vue";
import type { DialogProviderContext } from "./types";
import { DialogProviderContextKey } from "./types";

export const useDialog = (): DialogProviderContext => {
    const context = inject<DialogProviderContext>(DialogProviderContextKey);
    if (!context) {
        throw new Error("useDialog 只能在 DialogProvider 组件内使用");
    }
    return context;
};
