import { nanoid } from "nanoid";
import { h, render } from "vue";
import MLoading from "./Loading.vue";
import type { LoadingInstance, LoadingOptions, LoadingProps } from "./types";

const instances: Map<string, LoadingInstance> = new Map();
const createLoading = (options?: LoadingOptions): LoadingInstance => {
    const container = document.createElement("div");
    const id = nanoid();
    const destroy = (): void => {
        if (instances.has(id)) {
            instances.delete(id);
            render(null, container);
            container.remove();
        }
    };
    const newProps: LoadingProps = {
        ...options,
        id,
        onDestroy: destroy,
        zIndex: 15000 + instances.size
    };
    const vnode = h(MLoading, newProps);
    render(vnode, container);
    const instance: LoadingInstance = {
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
