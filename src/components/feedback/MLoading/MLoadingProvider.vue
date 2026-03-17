<template>
    <slot></slot>
    <MLoading v-bind="instance" v-if="instance" ref="loadingRef"></MLoading>
</template>

<script lang="ts" setup>
import { provide, ref, useTemplateRef } from "vue";
import MLoading from "./MLoading.vue";
import type { MLoadingInstance, MLoadingProps, MLoadingProviderContext } from "./types";
import { MLoadingProviderContextKey } from "./types";

defineOptions({
    name: "MLoadingProvider"
});

const instance = ref<MLoadingProps | null>(null);
const loadingRef = useTemplateRef<InstanceType<typeof MLoading>>("loadingRef");
const createLoading = (): MLoadingInstance => {
    if (instance.value !== null) {
        return {
            destroy: () => {
                if (loadingRef.value) {
                    loadingRef.value.close();
                }
            }
        };
    }
    instance.value = {
        onDestroy: () => {
            instance.value = null;
        },
        target: "body"
    };
    return {
        destroy: () => {
            if (loadingRef.value) {
                loadingRef.value.close();
            }
        }
    };
};

provide<MLoadingProviderContext>(MLoadingProviderContextKey, {
    create: createLoading
});
</script>

<style lang="scss" scoped></style>
