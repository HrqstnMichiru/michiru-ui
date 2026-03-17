import { h, render } from "vue";
import MLoading from "./MLoading.vue";
import type { MLoadingInstance, MLoadingProps } from "./types";

let globalLoadingInstance: MLoadingInstance | null = null;
const createLoading = (): MLoadingInstance => {
    if (globalLoadingInstance !== null) {
        return globalLoadingInstance;
    }

    const container = document.createElement("div");
    const props: MLoadingProps = {
        onDestroy: () => {
            render(null, container);
            container.remove();
            globalLoadingInstance = null;
        },
        target: "body"
    };

    const vnode = h(MLoading, props);
    render(vnode, container);

    globalLoadingInstance = {
        destroy: () => {
            const vm = vnode?.component;
            if (vm?.exposed?.close) {
                vm.exposed.close();
            }
        },
        vm: vnode.component!
    };

    return globalLoadingInstance;
};

export default {
    create: createLoading
};
