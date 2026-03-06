<template>
    <div>
        <slot></slot>
        <MImagePreview ref="imagePreviewRef" :list="imageList" :url-format="urlFormat" :show-toolbar="showToolbar" :show-tooltip="showTooltip" loop v-if="imageList.length > 0" />
    </div>
</template>

<script lang="ts" setup>
import { provide, ref, useTemplateRef } from "vue";
import MImagePreview from "./ImagePreview.vue";
import type { ImageGroupContext, ImageGroupInstance, ImageGroupProps, ImagePreviewInstance } from "./types";
import { ImageGroupContextKey } from "./types";

defineOptions({
    name: "MImageGroup"
});
const props = withDefaults(defineProps<ImageGroupProps>(), {
    position: "center",
    fit: "cover",
    showToolbar: true,
    urlFormat: (url: string) => url
});
const imagePreviewRef = useTemplateRef<ImagePreviewInstance>("imagePreviewRef");

const imageList = ref<string[]>([]);
const register = (src: string): number => {
    const index = imageList.value.length;
    imageList.value.push(src);
    return index;
};
const previewImage = (index: number) => {
    imagePreviewRef.value?.previewImage(index);
};

provide<ImageGroupContext>(ImageGroupContextKey, {
    position: props.position,
    fit: props.fit,
    urlFormat: props.urlFormat,
    register,
    previewImage
});

defineExpose<ImageGroupInstance>({
    previewImage
});
</script>

<style lang="scss" scoped></style>
