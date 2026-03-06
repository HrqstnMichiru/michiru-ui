import { nanoid } from "nanoid";
import { h, render, shallowReactive } from "vue";
import MMessage from "./Message.vue";
import type { MessageInstance, MessageOptions, MessageProps } from "./types";

const instances = shallowReactive<MessageInstance[]>([]);
const createMessage = (options: MessageOptions): MessageInstance => {
    const container = document.createElement("div");
    const id = Date.now().toString() + nanoid(6);
    const destroy = () => {
        const index = instances.findIndex(inst => inst.id === id);
        if (index === -1) return;
        instances.splice(index, 1);
        render(null, container);
        container.remove();
    };
    const newProps: MessageProps = {
        ...options,
        id,
        onDestroy: destroy,
        zIndex: 2000 + instances.length * 10
    };
    const vnode = h(MMessage, newProps);
    render(vnode, container);
    document.body.appendChild(container.firstElementChild!);
    const instance: MessageInstance = { id, vm: vnode.component!, destroy };
    instances.push(instance);
    return instance;
};

export const getLastBottomOffset = (id: string) => {
    const index = instances.findIndex(inst => inst.id === id);
    if (index <= 0) {
        return 0;
    } else {
        const prev = instances[index - 1];
        return prev!.vm.exposed!.bottomOffset.value; // 鑾峰彇涓婁竴涓秷鎭殑搴曢儴鍋忕Щ閲忥紝鐢ㄤ簬璁＄畻褰撳墠娑堟伅鐨勯《閮ㄥ亸绉婚噺锛岀粍浠跺唴鏆撮湶鐨?bottomOffset
    }
};

export default {
    create: createMessage,
    primary(message: string, props: Omit<MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "primary" });
    },
    success(message: string, props: Omit<MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "success" });
    },
    warning(message: string, props: Omit<MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "warning" });
    },
    info(message: string, props: Omit<MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "info" });
    },
    danger(message: string, props: Omit<MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "danger" });
    },
    purple(message: string, props: Omit<MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "purple" });
    },
    pink(message: string, props: Omit<MessageOptions, "variant" | "message"> = {}) {
        return createMessage({ ...props, message, variant: "pink" });
    },
    destroyAll() {
        instances.forEach(inst => inst.destroy());
    }
};
