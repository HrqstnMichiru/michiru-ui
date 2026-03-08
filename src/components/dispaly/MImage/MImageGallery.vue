<template>
    <div class="image-gallery">
        <div class="image-list" :style="{ width: `${width + 40}px`, height: `${height}px` }">
            <MImage
                v-for="(img, index) in list"
                :class="[
                    'gallery-item',
                    {
                        [`animate-enter-${transition}${transition === 'rotate' ? (isForward ? '-forward' : '-backward') : ''}`]: transition !== 'slide' && index === currentIndex && lastIndex !== -1,
                        [`animate-exit-${transition}${transition === 'rotate' ? (isForward ? '-forward' : '-backward') : ''}`]: transition !== 'slide' && index === lastIndex && lastIndex !== -1
                    }
                ]"
                :key="index"
                :src="img"
                square
                :error-size="errorSize"
                :url-format="urlFormat"
                :fit="fit"
                :position="position"
                :width="width + 40"
                :height="height"
                preview-disabled
                :lazy="lazy"
                :style="getImageStyle(index)"
                @click="onImageClick(index)"></MImage>
        </div>
        <div class="image-thumbnail-list">
            <MImage
                :error-size="errorSize"
                :src="img"
                :url-format="thumbFormat"
                :width="width / 5"
                :height="height / 5"
                preview-disabled
                v-for="(img, index) in list"
                :key="index"
                :lazy="lazy"
                class="thumbnail-item"
                :class="{ active: currentIndex === index }"
                @click="onThumbnailClick(index)"></MImage>
        </div>
        <MImagePreview ref="imagePreviewRef" loop v-if="!previewDisabled" :list="list" :url-format="urlFormat" :show-toolbar="showToolbar" :show-tooltip="showTooltip" />
    </div>
</template>

<script lang="ts" setup>
import { MImage, MImagePreview } from "@/components";
import { computed, ref, useTemplateRef } from "vue";
import type { MImageGalleryProps, MImagePreviewInstance } from "./types";

defineOptions({
    name: "MImageGallery"
});
const props = withDefaults(defineProps<MImageGalleryProps>(), {
    fit: "cover",
    position: "center",
    transition: "fade",
    urlFormat: (url: string) => url,
    thumbnailFormat: (url: string) => url,
    errorSize: "small",
    showToolbar: true
});
const imagePreviewRef = useTemplateRef<MImagePreviewInstance>("imagePreviewRef");
const list = computed(() => props.list);
const currentIndex = ref<number>(0);
const lastIndex = ref<number>(-1);
const isForward = ref<boolean>(true);
const isAnimating = ref<boolean>(false);

const getImageStyle = (index: number) => {
    const isCurrent = index === currentIndex.value;
    const isLast = index === lastIndex.value;
    const diff = index - currentIndex.value;

    if (props.transition === "slide") {
        return {
            zIndex: isCurrent ? 10 : 1,
            display: "block",
            transform: `translateX(${diff * 100}%)`,
            transition: "transform 800ms cubic-bezier(0.4, 0, 0.2, 1) 75ms",
            pointerEvents: isCurrent ? "auto" : "none"
        };
    }

    return {
        zIndex: isLast ? 20 : isCurrent ? 10 : 1,
        display: isCurrent || isLast ? "block" : "none",
        pointerEvents: isCurrent ? "auto" : "none"
    };
};

const onImageClick = (index: number) => {
    if (props.previewDisabled) return;
    imagePreviewRef.value?.previewImage(index);
};
const onThumbnailClick = (index: number) => {
    if (index === currentIndex.value) return;
    if (isAnimating.value) return;
    isForward.value = index > currentIndex.value;
    lastIndex.value = currentIndex.value;
    currentIndex.value = index;
    isAnimating.value = true;
    if (props.transition === "page") {
        setTimeout(() => {
            isAnimating.value = false;
        }, 1500);
    } else {
        setTimeout(() => {
            isAnimating.value = false;
        }, 800);
    }
};
</script>

<style lang="scss" scoped>
.image-gallery {
    display: flex;
    flex-direction: column;
    .image-list {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        .gallery-item {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
    }
    .image-thumbnail-list {
        display: flex;
        gap: 10px;
        margin-top: 15px;
        .thumbnail-item {
            cursor: pointer;
            border: 2px solid transparent !important;
            border-radius: 5px !important;
            transition: all 0.8s cubic-bezier(0.5, 1, 0.89, 1);
            opacity: 0.5;
            &:hover {
                opacity: 0.75;
            }
            &.active {
                border-color: #409eff !important;
                opacity: 1;
            }
        }
    }
}

/* ============================================================
    1. PAGE
  ============================================================ */
.animate-enter-page {
    animation: page-scale-in 1.5s cubic-bezier(0.5, 1, 0.89, 1) forwards;
}
.animate-exit-page {
    animation: page-clip-exit 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes page-scale-in {
    from {
        transform: scale(1.2);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes page-clip-exit {
    0% {
        clip-path: polygon(-50% 50%, 50% -50%, 150% 50%, 50% 150%);
    }
    100% {
        clip-path: polygon(50% -50%, 150% -150%, 250% -50%, 150% 50%);
    }
}

/* ============================================================
    2. ROTATE
  ============================================================ */
.animate-enter-rotate-forward,
.animate-enter-rotate-backward {
    animation: rotate-in 0.8s ease forwards;
}
.animate-exit-rotate-forward {
    animation: rotate-out-forward 0.8s ease forwards;
}
.animate-exit-rotate-backward {
    animation: rotate-out-backward 0.8s ease forwards;
}

@keyframes rotate-in {
    from {
        transform: scale(1.2);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
@keyframes rotate-out-forward {
    from {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 1;
    }
    to {
        transform: translate(-100%, 100%) rotate(-45deg) scale(0.5);
        opacity: 0;
    }
}
@keyframes rotate-out-backward {
    from {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 1;
    }
    to {
        transform: translate(100%, -100%) rotate(45deg) scale(0.5);
        opacity: 0;
    }
}

/* ============================================================
    3. FADE
   ============================================================ */
.animate-enter-fade {
    animation: fade-in 0.8s ease forwards;
}
.animate-exit-fade {
    animation: fade-out 0.8s ease forwards;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
@keyframes fade-out {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
