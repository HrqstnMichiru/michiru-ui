<template>
    <slot></slot>
    <template v-for="instance in instances" :key="instance.id">
        <MLoading v-bind="instance"></MLoading>
    </template>
</template>

<script lang="ts" setup>
import { nanoid } from "nanoid";
import { provide, shallowReactive } from "vue";
import MLoading from "./Loading.vue";
import type { _LoadingInstance, LoadingOptions, LoadingProviderContext, LoadingProviderProps } from "./types";
import { LoadingProviderContextKey } from "./types";

defineOptions({
    name: "MLoadingProvider"
});
const props = withDefaults(defineProps<LoadingProviderProps>(), {
    maxCount: 5,
    zIndex: 9999
});

const instances = shallowReactive<_LoadingInstance[]>([]);
const createLoading = (options?: LoadingOptions): _LoadingInstance => {
    if (instances.length >= props.maxCount) {
        // 濡傛灉瓒呰繃鏈€澶ф暟閲忥紝閿€姣佹渶鏃╃殑涓€涓疄渚?        instances.shift();
    }
    console.log("Creating loading with options:", options);
    const id = Date.now().toString() + nanoid(6);
    const instance: _LoadingInstance = {
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

provide<LoadingProviderContext>(LoadingProviderContextKey, {
    create: createLoading,
    destroyAll: (): void => {
        instances.splice(0, instances.length);
    }
});
</script>

<style lang="scss" scoped></style>
