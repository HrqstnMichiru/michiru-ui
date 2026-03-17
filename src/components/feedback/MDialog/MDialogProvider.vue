<template>
    <slot></slot>
    <template v-for="instance in instances" :key="instance.id">
        <MDialog v-bind="instance"></MDialog>
    </template>
</template>

<script lang="ts" setup>
import { nanoid } from "nanoid";
import { provide, reactive, shallowReactive } from "vue";
import MDialog from "./MDialog.vue";
import type { MDialogInstance, MDialogOptions, MDialogProviderContext, MDialogProviderProps } from "./types";
import { MDialogProviderContextKey } from "./types";

defineOptions({
    name: "MDialogProvider"
});
const props = withDefaults(defineProps<MDialogProviderProps>(), {
    width: 420,
    maxCount: Infinity
});

const instances = shallowReactive<MDialogInstance[]>([]);
const createDialog = (options: MDialogOptions) => {
    if (instances.length >= props.maxCount) {
        instances.shift();
    }
    const id = Date.now().toString() + nanoid(6);
    const instance = reactive<MDialogInstance>({
        ...options,
        width: options.width || props.width,
        maskClosable: options.maskClosable ? options.maskClosable : props.maskClosable,
        onDestroy: () => destroyDialog(id),
        loading: false,
        zIndex: 2000 + instances.length * 10,
        id
    });
    instances.push(instance);
    return instance;
};
const destroyDialog = (id: string) => {
    const index = instances.findIndex(inst => inst.id === id);
    if (index === -1) return;
    instances.splice(index, 1);
};

provide<MDialogProviderContext>(MDialogProviderContextKey, {
    create: createDialog,
    alert: (message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title,
            variant: options?.variant,
            showCancel: false
        });
    },
    confirm: (message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "loading" | "showCancel">) => {
        return createDialog({
            ...options,
            message,
            title: title,
            variant: options?.variant,
            showCancel: true
        });
    },
    primary: (message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "消息",
            variant: "primary",
            showCancel: true
        });
    },
    success: (message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "成功",
            variant: "success",
            showCancel: true
        });
    },
    warning: (message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "警告",
            variant: "warning",
            showCancel: true
        });
    },
    info: (message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "提示",
            variant: "info",
            showCancel: true
        });
    },
    danger: (message: string, title?: string, options?: Omit<MDialogOptions, "message" | "title" | "variant" | "showCancel" | "loading">) => {
        return createDialog({
            ...options,
            message,
            title: title || "错误",
            variant: "danger",
            showCancel: true
        });
    },
    destroyAll() {
        instances.splice(0, instances.length);
    }
});
</script>

