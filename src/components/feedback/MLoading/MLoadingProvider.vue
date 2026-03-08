<template>
    <slot></slot>
    <template v-for="instance in instances" :key="instance.id">
        <MLoading v-bind="instance"></MLoading>
    </template>
</template>

<script lang="ts" setup>
import { nanoid } from "nanoid";
import { provide, shallowReactive } from "vue";
import MLoading from "./MLoading.vue";
import type { _MLoadingInstance, MLoadingOptions, MLoadingProviderContext, MLoadingProviderProps } from "./types";
import { MLoadingProviderContextKey } from "./types";

defineOptions({
    name: "MLoadingProvider"
});
const props = withDefaults(defineProps<MLoadingProviderProps>(), {
    maxCount: 5,
    zIndex: 9999
});

const instances = shallowReactive<_MLoadingInstance[]>([]);
const createLoading = (options?: MLoadingOptions): _MLoadingInstance => {
    if (instances.length >= props.maxCount) {
        instances.shift();
    }
    console.log("Creating loading with options:", options);
    const id = Date.now().toString() + nanoid(6);
    const instance: _MLoadingInstance = {
        ...options,
        id,
        onDestroy: () => destroyLoading(id),
        zIndex: props.zIndex + instances.length * 10
    };
    instances.push(instance);
    return instance;
};
const destroyLoading = (id: string): void => {
    const index = instances.findIndex(inst => inst.id === id);
    if (index === -1) return;
    instances.splice(index, 1);
};

provide<MLoadingProviderContext>(MLoadingProviderContextKey, {
    create: createLoading,
    destroyAll: (): void => {
        instances.splice(0, instances.length);
    }
});
</script>

<style lang="scss" scoped></style>
