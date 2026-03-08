import { nanoid } from "nanoid";
import { h, render, shallowReactive } from "vue";
import MMessage from "./MMessage.vue";
import type { MMessageInstance, MMessageOptions, MMessageProps } from "./types";

const instances = shallowReactive<MMessageInstance[]>([]);
const createMessage = (options: MMessageOptions): MMessageInstance => {
    const container = document.createElement("div");
    const id = Date.now().toString() + nanoid(6);
    const destroy = () => {
        const index = instances.findIndex(inst => inst.id === id);
        if (index === -1) return;
        instances.splice(index, 1);
        render(null, container);
        container.remove();
    };
    const newProps: MMessageProps = {
        ...options,
        id,
        onDestroy: destroy,
        zIndex: 2000 + instances.length * 10
    };
    const vnode = h(MMessage, newProps);
    render(vnode, container);
    document.body.appendChild(container.firstElementChild!);
    const instance: MMessageInstance = { id, vm: vnode.component!, destroy };
    instances.push(instance);
    return instance;
};

export const getLastBottomOffset = (id: string) => {
    const index = instances.findIndex(inst => inst.id === id);
    if (index <= 0) {
        return 0;
    } else {
        const prev = instances[index - 1];
        return prev!.vm.exposed!.bottomOffset.value;
    }
};

export default {
    create: createMessage,
    primary(message: string, props: Omit<MMessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "primary" });
    },
    success(message: string, props: Omit<MMessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "success" });
    },
    warning(message: string, props: Omit<MMessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "warning" });
    },
    info(message: string, props: Omit<MMessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "info" });
    },
    danger(message: string, props: Omit<MMessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "danger" });
    },
    purple(message: string, props: Omit<MMessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "purple" });
    },
    pink(message: string, props: Omit<MMessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "pink" });
    },
    destroyAll() {
        instances.forEach(inst => inst.destroy());
    }
};
