<template>
    <Teleport :to="to">
        <div
            class="loading-wrapper"
            :class="{ 'loading-wrapper--fullscreen': isFullscreen }"
            :style="{
                backgroundColor: bgColor,
                zIndex: zIndex
            }">
            <img :src="src" @dragstart.prevent />
            <div
                class="loading-text"
                :style="{
                    fontSize: `${loadingFontSize}px`,
                    gap: `${loadingGap}px`
                }">
                <span>正</span>
                <span>在</span>
                <span>拼</span>
                <span>命</span>
                <span>加</span>
                <span>载</span>
                <span>中</span>
                <span>...</span>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import loadingImage from "@/assets/image/iloli.gif";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { LoadingProps } from "./types";

defineOptions({
    name: "MLoading"
});
const props = withDefaults(defineProps<LoadingProps>(), {
    src: loadingImage,
    to: "body",
    theme: "light",
    zIndex: 9999
});

const bgColor = computed(() => {
    return props.theme === "light" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";
});
const isFullscreen = computed(() => {
    return props.to === "body";
});
const ratio = ref(1);
const originalOverflow = ref<string>(""); // 保存原始 overflow 值
// 根据容器宽度和页面宽度的比例动态计算字体大小
const loadingFontSize = computed(() => {
    return Math.max(16, Math.round(28 * ratio.value));
});
const loadingGap = computed(() => {
    return Math.round(10 * ratio.value);
});

// 获取目标元素和页面尺寸
const updateSizes = () => {
    const targetElement = typeof props.to === "string" ? document.querySelector(props.to) : props.to;
    if (!targetElement) return;
    const containerWidth = targetElement.clientWidth;
    const pageWidth = window.innerWidth;
    ratio.value = containerWidth / pageWidth;
};
// 锁定/解锁 body 滚动
const lockBodyScroll = () => {
    if (props.to !== "body") return;
    originalOverflow.value = document.body.style.overflow;
    document.body.style.overflow = "hidden";
};
const unlockBodyScroll = () => {
    if (props.to !== "body") return;
    document.body.style.overflow = originalOverflow.value;
};

onMounted(() => {
    lockBodyScroll();
    updateSizes();
});
onBeforeUnmount(() => {
    unlockBodyScroll();
});
</script>

<style lang="scss" scoped>
.loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    user-select: none;
    backdrop-filter: blur(10px);
    position: absolute;
    inset: 0;
    &.loading-wrapper--fullscreen {
        position: fixed;
        height: 100%;
        width: 100%;
    }
    img {
        height: 40%;
        object-fit: contain;
    }
    .loading-text {
        font-weight: 500;
        display: flex;
        align-items: center;
        /* 让每个字符单独动画 */
        span {
            display: inline-block;
            transform: translateY(0);
            animation-name: bounce;
            animation-duration: 2s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            animation-fill-mode: both;
            background: linear-gradient(90deg, #4096e1 0%, #7c3aed 50%, #f472b6 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        /* 交错延迟，产生波浪效果 */
        span:nth-child(1) {
            animation-delay: 0s;
        }
        span:nth-child(2) {
            animation-delay: 0.2s;
        }
        span:nth-child(3) {
            animation-delay: 0.3s;
        }
        span:nth-child(4) {
            animation-delay: 0.4s;
        }
        span:nth-child(5) {
            animation-delay: 0.5s;
        }
        span:nth-child(6) {
            animation-delay: 0.6s;
        }
        span:nth-child(7) {
            animation-delay: 0.7s;
        }
        span:nth-child(8) {
            animation-delay: 0.8s;
        }
    }

    /* 上下浮动关键帧（向上移动然后回到原位） */
    @keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-30px);
            filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.2)) blur(1px);
        }
        60% {
            transform: translateY(-15px);
            filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.15));
        }
    }
}
</style>
