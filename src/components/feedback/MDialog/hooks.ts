import { inject } from "vue";
import type { MDialogProviderContext } from "./types";
import { MDialogProviderContextKey } from "./types";

export const useDialog = (): MDialogProviderContext => {
    const context = inject<MDialogProviderContext>(MDialogProviderContextKey);
    if (!context) {
        throw new Error("useDialog 只能在 DialogProvider 组件内使用");
    }
    return context;
};
