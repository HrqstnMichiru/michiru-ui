import { inject } from "vue";
import type { MMessageProviderContext } from "./types";
import { MMessageProviderContextKey } from "./types";

export const useMessage = (): MMessageProviderContext => {
    const context = inject<MMessageProviderContext>(MMessageProviderContextKey);
    if (!context) {
        throw new Error("useMessage 只能在 MessageProvider 组件内使用");
    }
    return context;
};
