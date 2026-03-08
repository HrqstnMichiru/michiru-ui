<template>
    <div
        class="image"
        :style="{
            width: `${width}px`,
            height: `${height}px`,
            borderRadius: square ? '0px' : circle ? '50%' : rounded ? '500px' : '10px',
            border: showBorder ? '1px solid #dcdfe6' : 'none'
        }">
        <div v-if="loading" class="image__loading">
            <MIcon name="hugeicons:image-03"></MIcon>
        </div>
        <div v-else-if="hasError" class="image__error">
            <img :src="errorImage" class="error-img" />
            <span
                class="error-text"
                :style="{
                    fontSize: `${errorFontSize}px`
                }">
                加载失败了喵(&gt;﹏&lt;)
            </span>
        </div>
        <img
            :loading="customLazy ? 'lazy' : 'eager'"
            @click="handleImageClick"
            v-show="!loading && !hasError"
            :src="displaySrc"
            class="image__normal"
            @load="handleLoad"
            @error="handleError"
            :style="{
                objectFit: fit,
                objectPosition: position
            }" />
        <MImagePreview ref="imagePreviewRef" v-if="!previewDisabled && !imageGroupContext" :src="displaySrc" :show-toolbar="showToolbar" :show-tooltip="showTooltip" />
    </div>
</template>

<script lang="ts" setup>
import errorImage from "@/assets/image/小春.png";
import type { MImagePreviewInstance } from "@/components";
import { MIcon, MImagePreview } from "@/components";
import { computed, inject, ref, useTemplateRef, watch } from "vue";
import type { MImageGroupContext, MImageInstance, MImageProps } from "./types";
import { MImageGroupContextKey } from "./types";

defineOptions({
    name: "MImage"
});
const props = withDefaults(defineProps<MImageProps>(), {
    fit: "cover",
    errorSize: "small",
    position: "center",
    urlFormat: (url: string) => url,
    showToolbar: true
});
const _index = ref<number>(-1);
const imageGroupContext = inject<MImageGroupContext | null>(MImageGroupContextKey, null);
if (imageGroupContext) {
    _index.value = imageGroupContext.register(props.src);
}
const customLazy = computed(() => {
    return props.lazy || imageGroupContext?.lazy;
});

const imagePreviewRef = useTemplateRef<MImagePreviewInstance>("imagePreviewRef");
const displaySrc = computed(() => {
    if (imageGroupContext && imageGroupContext.urlFormat) {
        return imageGroupContext.urlFormat(props.src);
    }
    return props.urlFormat(props.src);
});

const sizeMap: Record<"small" | "medium" | "large", number> = {
    small: 14,
    medium: 18,
    large: 22
};
const errorFontSize = computed(() => {
    if (typeof props.errorSize === "number") {
        return props.errorSize;
    } else if (props.errorSize && sizeMap[props.errorSize]) {
        return sizeMap[props.errorSize];
    }
    return 14;
});

const hasError = ref<boolean>(false); // 是否加载失败
const loading = ref<boolean>(true); // 是否正在加载，初始为true，等待图片加载完成后设置为false

watch(
    () => props.src,
    () => {
        loading.value = true;
        hasError.value = false;
    }
);

const handleLoad = async () => {
    hasError.value = false;
    loading.value = false;
};

const handleError = async () => {
    hasError.value = true;
    loading.value = false;
};

const handleImageClick = () => {
    if (props.previewDisabled) return;
    if (imageGroupContext) {
        imageGroupContext.previewImage(_index.value);
        return;
    }
    imagePreviewRef.value?.previewImage();
};

defineExpose<MImageInstance>({
    previewImage: handleImageClick
});
</script>

<style lang="scss" scoped>
.image {
    width: 100%;
    height: 100%;
    overflow: hidden;
    flex-shrink: 0;
    .image__normal {
        width: 100%;
        height: 100%;
    }
    .image__error {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        .error-text {
            white-space: nowrap;
            overflow: hidden;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            background-image: linear-gradient(to right, #ffc0cb 0%, #ff69b4 30%, #463f3a 60%, #465b70 80%, #2c3e50 100%);
        }
        .error-img {
            height: 70%;
            object-fit: contain;
        }
    }
    .image__loading {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
        background-size: 400% 100%;
        animation: skeleton-loading 1.4s ease infinite;
        color: #909399;
    }
}

@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
