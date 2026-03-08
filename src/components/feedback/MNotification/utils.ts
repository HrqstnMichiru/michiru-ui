import { nanoid } from "nanoid";
import { h, render, shallowReactive, type ShallowReactive } from "vue";
import MNotification from "./MNotification.vue";
import type { MNotificationInstance, MNotificationOptions, MNotificationPlacement, MNotificationProps } from "./types";

const instances: Record<MNotificationPlacement, ShallowReactive<MNotificationInstance[]>> = {
    "top-right": shallowReactive([]),
    "top-left": shallowReactive([]),
    "bottom-right": shallowReactive([]),
    "bottom-left": shallowReactive([])
};

export const createNotification = (options: MNotificationOptions): MNotificationInstance => {
    const container = document.createElement("div");
    const id = Date.now().toString() + nanoid(6);
    const placement = options.placement || "top-right";
    const destroy = () => {
        const placementInstances = instances[placement];
        const index = placementInstances.findIndex(inst => inst.id === id);
        if (index === -1) return;
        placementInstances.splice(index, 1);
        render(null, container);
        container.remove();
    };
    const newProps: MNotificationProps = {
        ...options,
        id,
        onDestroy: destroy,
        zIndex: 2000 + instances[placement].length * 10
    };
    const vnode = h(MNotification, newProps);
    render(vnode, container);
    document.body.appendChild(container.firstElementChild!);
    const instance: MNotificationInstance = { id, vm: vnode.component!, destroy };
    instances[placement].push(instance);
    return instance;
};

export const getLastOffset = (placement: MNotificationPlacement, id: string): number => {
    const placementInstances = instances[placement];
    const index = placementInstances.findIndex(inst => inst.id === id);
    if (index <= 0) {
        return 0;
    } else {
        const prev = placementInstances[index - 1];
        return prev!.vm.exposed!.extraOffsetY.value;
    }
};

export default {
    create: createNotification,
    primary(message: string, props: Omit<MNotificationOptions, "variant" | "message"> = {}) {
        return createNotification({ ...props, message, variant: "primary" });
    },
    success(message: string, props: Omit<MNotificationOptions, "variant" | "message"> = {}) {
        return createNotification({ ...props, message, variant: "success" });
    },
    warning(message: string, props: Omit<MNotificationOptions, "variant" | "message"> = {}) {
        return createNotification({ ...props, message, variant: "warning" });
    },
    danger(message: string, props: Omit<MNotificationOptions, "variant" | "message"> = {}) {
        return createNotification({ ...props, message, variant: "danger" });
    },
    info(message: string, props: Omit<MNotificationOptions, "variant" | "message"> = {}) {
        return createNotification({ ...props, message, variant: "info" });
    },
    destroyAll() {
        (Object.keys(instances) as MNotificationPlacement[]).forEach(placement => {
            instances[placement].forEach(inst => inst.destroy());
        });
    }
};
