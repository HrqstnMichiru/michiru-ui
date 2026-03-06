<template>
    <Teleport to="body">
        <Transition name="fade-translate">
            <div v-if="visible" class="image-preview-overlay">
                <div class="image-preview-close" @click="handleClose">
                    <span class="close-icon"></span>
                </div>
                <div class="image-preview-wrapper" @wheel.prevent="handleWheel">
                    <div
                        class="image-preview-inner"
                        :style="{
                            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`
                        }"
                        @mousedown.prevent="handleMouseDown">
                        <img
                            :src="currentImage"
                            class="preview-image"
                            :style="{
                                transform: `rotate(${rotation}deg)`
                            }"
                            @dragstart.stop
                            v-if="currentImage"
                            @load="resetTransform()" />
                    </div>
                </div>

                <!-- 切换按钮 -->
                <span v-if="multiple && (loop || currentIndex > 0)" class="image-preview-prev" @click="prevImage"></span>
                <span v-if="multiple && (loop || currentIndex < total - 1)" class="image-preview-next" @click="nextImage"></span>

                <!-- 图片信息 -->
                <div v-if="multiple" class="image-preview-info">{{ currentIndex + 1 }}/{{ total }}</div>
                <!-- 工具栏 -->
                <div v-if="showToolbar" class="image-preview-toolbar">
                    <MTooltip placement="top" content="缩小" :disabled="!showTooltip">
                        <MIcon name="teenyicons:zoom-out-outline" :size="22" @click="zoomOut" />
                    </MTooltip>
                    <MTooltip placement="top" content="放大" :disabled="!showTooltip">
                        <MIcon name="teenyicons:zoom-in-outline" :size="22" @click="zoomIn" />
                    </MTooltip>
                    <MTooltip placement="top" content="向左旋转" :disabled="!showTooltip">
                        <MIcon name="ri:reset-left-line" :size="22" @click="rotateLeft" />
                    </MTooltip>
                    <MTooltip placement="top" content="向右旋转" :disabled="!showTooltip">
                        <MIcon name="ri:reset-right-fill" :size="22" @click="rotateRight" />
                    </MTooltip>
                    <MTooltip placement="top" content="重置" :disabled="!showTooltip">
                        <MIcon name="lucide:focus" :size="22" @click="resetTransform" />
                    </MTooltip>
                    <MTooltip placement="top" content="下载" :disabled="!showTooltip">
                        <MIcon name="solar:download-minimalistic-bold" :size="22" @click="download" />
                    </MTooltip>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script lang="ts" setup>
import { MIcon, MTooltip } from "@/components";
import { computed, ref } from "vue";
import type { ImagePreviewInstance, ImagePreviewProps } from "./types";

defineOptions({
    name: "MImagePreview"
});
const props = withDefaults(defineProps<ImagePreviewProps>(), {
    showToolbar: true,
    showTooltip: false,
    urlFormat: (url: string) => url
});

const visible = ref<boolean>(false);
const scale = ref<number>(1);
const rotation = ref<number>(0);
const translateX = ref<number>(0);
const translateY = ref<number>(0);
const dragStart = ref({ x: 0, y: 0 });
const currentIndex = ref<number>(0);
const currentImage = computed(() => {
    if (props.src) {
        return props.urlFormat(props.src);
    }
    if (props.list && currentIndex.value >= 0 && currentIndex.value < props.list.length) {
        return props.urlFormat(props.list[currentIndex.value]!);
    }
    return "";
});
const multiple = computed(() => props.list && props.list.length > 0);
const total = computed(() => (props.list ? props.list.length : 0));

const handleClose = () => {
    visible.value = false;
    resetTransform();
    currentIndex.value = 0;
};

const resetTransform = () => {
    scale.value = 1;
    rotation.value = 0;
    translateX.value = 0;
    translateY.value = 0;
};

const zoomIn = () => {
    if (scale.value < 3) {
        scale.value = Math.min(3, scale.value + 0.2);
    }
};

const zoomOut = () => {
    if (scale.value > 0.2) {
        scale.value = Math.max(0.2, scale.value - 0.2);
    }
};

const rotateLeft = () => {
    rotation.value -= 90;
};

const rotateRight = () => {
    rotation.value += 90;
};

const download = async () => {
    if (!currentImage.value) return;
    const response = await fetch(currentImage.value);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `image_${currentIndex.value + 1}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

const handleWheel = (e: WheelEvent) => {
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.2, Math.min(3, scale.value + delta));
    scale.value = newScale;
};

const prevImage = () => {
    if (!props.list || props.list.length <= 1) return;
    if (props.loop) {
        currentIndex.value = (currentIndex.value - 1 + props.list.length) % props.list.length;
        return;
    }
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

const nextImage = () => {
    if (!props.list || props.list.length <= 1) return;
    if (props.loop) {
        currentIndex.value = (currentIndex.value + 1) % props.list.length;
        return;
    }
    if (currentIndex.value < props.list.length - 1) {
        currentIndex.value++;
    }
};

const handleMouseDown = (e: MouseEvent) => {
    dragStart.value = {
        x: e.clientX - translateX.value * scale.value,
        y: e.clientY - translateY.value * scale.value
    };

    const handleMouseMove = (e: MouseEvent) => {
        translateX.value = (e.clientX - dragStart.value.x) / scale.value;
        translateY.value = (e.clientY - dragStart.value.y) / scale.value;
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
};

const previewImage = (index?: number) => {
    if (index && props.list && index >= 0 && index < props.list.length) {
        currentIndex.value = index;
    }
    visible.value = true;
};

defineExpose<ImagePreviewInstance>({
    previewImage
});
</script>

<style lang="scss" scoped>
.image-preview-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    .image-preview-close {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 2001;
        width: 60px;
        height: 60px;
        cursor: pointer;
        background-image: url("@/assets/image/关闭外围.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        .close-icon {
            width: 24px;
            height: 24px;
            background-image: url("@/assets/image/关闭.png");
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            transition: background-image 0.3s ease-in-out;
        }
        &:hover .close-icon {
            background-image: url("@/assets/image/关闭hover.png");
        }
    }
    .image-preview-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        .image-preview-inner {
            width: fit-content;
            height: 100%;
            max-height: 70%;
            display: flex;
            align-items: center;
            justify-content: center;
            .preview-image {
                width: fit-content;
                height: 100%;
                object-fit: contain;
                transition: transform 0.3s ease;
            }
        }
    }
    .image-preview-prev,
    .image-preview-next {
        position: absolute;
        z-index: 2001;
        width: 45px;
        height: 64px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
    .image-preview-prev {
        left: 40px;
        background-image: url("@/assets/image/左按钮.png");
        transition: background-image 0.3s ease-in-out;
        &:hover {
            background-image: url("@/assets/image/左按钮浅.png");
        }
    }
    .image-preview-next {
        right: 40px;
        background-image: url("@/assets/image/右按钮.png");
        transition: background-image 0.3s ease-in-out;
        &:hover {
            background-image: url("@/assets/image/右按钮浅.png");
        }
    }
    .image-preview-info {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2001;
        color: #fff;
        font-size: 16px;
        font-weight: 500;
    }
    .image-preview-toolbar {
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2001;
        gap: 5px;
        height: 44px;
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.75);
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        :deep(.m-icon) {
            border-radius: 50%;
            height: 35px;
            width: 35px;
            line-height: 35px;
            text-align: center;
            position: relative;
            cursor: pointer;
            &::after {
                position: absolute;
                inset: 0;
                border-radius: 50%;
                content: "";
                opacity: 0;
                z-index: -1;
                background-color: rgba(255, 255, 255, 0.2);
            }
            &:hover::after {
                opacity: 1;
            }
        }
    }
}

.fade-translate-enter-active,
.fade-translate-leave-active {
    transition: all 0.3s ease;
}

.fade-translate-enter-from,
.fade-translate-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
