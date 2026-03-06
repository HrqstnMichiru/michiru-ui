import { MLoading } from "@/components";
import type { DirectiveBinding } from "vue";

const loading = {
    mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
        el.style.position = "relative";
        if (binding.value) {
            const loadingInstance = MLoading.create({ to: el });
            (el as any)._loadingInstance = loadingInstance;
        }
    },
    updated(el: HTMLElement, binding: DirectiveBinding<boolean>) {
        if (binding.value) {
            if (!(el as any)._loadingInstance) {
                const loadingInstance = MLoading.create({ to: el });
                (el as any)._loadingInstance = loadingInstance;
            }
        } else {
            (el as any)._loadingInstance?.destroy();
            (el as any)._loadingInstance = null;
        }
    }
};

export default loading;
