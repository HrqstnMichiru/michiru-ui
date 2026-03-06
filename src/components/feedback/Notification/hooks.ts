import { inject } from "vue";
import type { NotificationProviderContext } from "./types";
import { NotificationProviderContextKey } from "./types";

export const useNotification = (): NotificationProviderContext => {
    const context = inject<NotificationProviderContext>(NotificationProviderContextKey);
    if (!context) {
        throw new Error("useNotification 只能在 NotificationProvider 组件内使用");
    }
    return context;
};
