import { nanoid } from "nanoid";
import { h, render } from "vue";
import MLoading from "./MLoading.vue";
import type { MLoadingInstance, MLoadingOptions, MLoadingProps } from "./types";

const instances: Map<string, MLoadingInstance> = new Map();
const createLoading = (options?: MLoadingOptions): MLoadingInstance => {
    const container = document.createElement("div");
    const id = nanoid();
    const destroy = (): void => {
        if (instances.has(id)) {
            instances.delete(id);
            render(null, container);
            container.remove();
        }
    };
    const newProps: MLoadingProps = {
        ...options,
        id,
        onDestroy: destroy,
        zIndex: 15000 + instances.size
    };
    const vnode = h(MLoading, newProps);
    render(vnode, container);
    const instance: MLoadingInstance = {
        id,
        destroy
    };
    instances.set(id, instance);
    return instance;
};
export default {
    create: createLoading,
    destroyAll: (): void => {
        instances.forEach(instance => instance.destroy());
    }
};
