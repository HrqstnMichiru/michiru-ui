import { inject } from "vue";
import type { MNotificationProviderContext } from "./types";
import { MNotificationProviderContextKey } from "./types";

export const useNotification = (): MNotificationProviderContext => {
    const context = inject<MNotificationProviderContext>(MNotificationProviderContextKey);
    if (!context) {
        throw new Error("useNotification 只能在 NotificationProvider 组件内使用");
    }
    return context;
};
