<template>
    <div>
        <slot></slot>
        <MImagePreview ref="imagePreviewRef" :list="imageList" :url-format="urlFormat" :show-toolbar="showToolbar" :show-tooltip="showTooltip" loop v-if="previewEnabled && imageList.length > 0" />
    </div>
</template>

<script lang="ts" setup>
import { provide, ref, useTemplateRef } from "vue";
import MImagePreview from "./MImagePreview.vue";
import type { MImageGroupContext, MImageGroupInstance, MImageGroupProps, MImagePreviewInstance } from "./types";
import { MImageGroupContextKey } from "./types";

defineOptions({
    name: "MImageGroup"
});
const props = withDefaults(defineProps<MImageGroupProps>(), {
    position: "center",
    fit: "cover",
    showToolbar: true,
    urlFormat: (url: string) => url
});
const imagePreviewRef = useTemplateRef<MImagePreviewInstance>("imagePreviewRef");

const imageList = ref<string[]>([]);
const register = (src: string): number => {
    const index = imageList.value.length;
    imageList.value.push(src);
    return index;
};
const previewImage = (index: number) => {
    if (!props.previewEnabled) return;
    imagePreviewRef.value?.previewImage(index);
};

provide<MImageGroupContext>(MImageGroupContextKey, {
    position: props.position,
    fit: props.fit,
    lazy: props.lazy,
    urlFormat: props.urlFormat,
    register,
    previewImage
});

defineExpose<MImageGroupInstance>({
    previewImage
});
</script>

<style lang="scss" scoped></style>
