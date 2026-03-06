import { nanoid } from "nanoid";
import { h, reactive, render, shallowReactive } from "vue";
import MDialog from "./Dialog.vue";
import type { DialogInstance, DialogOptions } from "./types";

const instances = shallowReactive<Map<string, DialogInstance>>(new Map());
const createDialog = (options: DialogOptions) => {
    const container = document.createElement("div");
    const id = Date.now().toString() + nanoid(6);
    const instance = reactive<DialogInstance>({
        ...options,
        onDestroy: () => destroyDialog(id, container),
        loading: false,
        zIndex: 2000 + instances.size * 10,
        id
    });
    const vnode = h(MDialog, instance);
    render(vnode, container);
    instances.set(id, instance);
    return instance;
};
const destroyDialog = (id: string, container: HTMLDivElement) => {
    instances.delete(id);
    render(null, container);
    container.remove();
};

export default {
    create: createDialog,
    alert: (message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title,
            variant: options?.variant,
            showCancel: false
        });
    },
    confirm: (message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "loading" | "showCancel">) => {
        return createDialog({
            ...options,
            message,
            title: title,
            variant: options?.variant,
            showCancel: true
        });
    },
    primary: (message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "娑堟伅",
            variant: "primary",
            showCancel: true
        });
    },
    success: (message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "鎴愬姛",
            variant: "success",
            showCancel: true
        });
    },
    warning: (message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "璀﹀憡",
            variant: "warning",
            showCancel: true
        });
    },
    info: (message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "鎻愮ず",
            variant: "info",
            showCancel: true
        });
    },
    danger: (message: string, title?: string, options?: Omit<DialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "閿欒",
            variant: "danger",
            showCancel: true
        });
    },
    destroyAll() {
        instances.forEach(inst => {
            inst.onDestroy();
        });
    }
};
