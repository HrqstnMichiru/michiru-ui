<template>
    <slot></slot>
    <MLoading v-bind="instance" v-if="instance" ref="loadingRef"></MLoading>
</template>

<script lang="ts" setup>
import { provide, ref, useTemplateRef } from "vue";
import MLoading from "./MLoading.vue";
import type { MLoadingInstance, MLoadingProps, MLoadingProviderContext, MLoadingProviderProps } from "./types";
import { MLoadingProviderContextKey } from "./types";

defineOptions({
    name: "MLoadingProvider"
});
const props = withDefaults(defineProps<MLoadingProviderProps>(), {
    duration: 300
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
        target: "body",
        duration: props.duration
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
