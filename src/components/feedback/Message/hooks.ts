import { inject } from "vue";
import type { MessageProviderContext } from "./types";
import { MessageProviderContextKey } from "./types";

export const useMessage = (): MessageProviderContext => {
    const context = inject<MessageProviderContext>(MessageProviderContextKey);
    if (!context) {
        throw new Error("useMessage 只能在 MessageProvider 组件内使用");
    }
    return context;
};
