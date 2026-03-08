<template>
    <div
        :class="['progress', `progress--${props.variant}`]"
        :style="{
            width: type === 'line' ? '100%' : `${width}px`
        }">
        <!-- 线性进度条 -->
        <div v-if="type === 'line'" class="progress-line">
            <div class="progress-line__outer" :style="{ height: `${strokeWidth + 2}px`, backgroundColor }">
                <div
                    class="progress-line__inner"
                    :style="{ width: `${percentage}%` }"
                    :class="{
                        'progress-line__inner--animated': props.animate
                    }"></div>
            </div>
            <div
                v-if="showText"
                class="progress-line__text"
                :style="{
                    color: textColor
                }">
                {{ displayText }}
            </div>
        </div>

        <!-- 圆形进度条 -->
        <div v-else class="progress-circle" :style="{ width: `${width}px`, height: `${width}px` }">
            <svg :width="width" :height="width" viewBox="0 0 100 100">
                <!-- 背景圆环 -->
                <circle :cx="50" :cy="50" :r="radius" fill="none" :stroke="trackColor" :stroke-width="relativeStrokeWidth" />
                <!-- 进度圆环 -->
                <circle
                    :cx="50"
                    :cy="50"
                    :r="radius"
                    fill="none"
                    :stroke="strokeColor"
                    :stroke-width="relativeStrokeWidth"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="strokeDashoffset"
                    stroke-linecap="round"
                    class="progress-circle__path" />
            </svg>
            <div v-if="showText" class="progress-circle__text">{{ displayText }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { MProgressProps } from "./types";

defineOptions({
    name: "MProgress"
});

const props = withDefaults(defineProps<MProgressProps>(), {
    percentage: 0,
    type: "line",
    strokeWidth: 8,
    width: 120,
    showText: true,
    variant: "primary",
    textInside: false,
    backgroundColor: "#e5e5e5",
    animate: true,
    textColor: "#606266"
});

// 显示文本
const displayText = computed(() => {
    if (props.format) {
        return props.format(props.percentage);
    }
    return `${props.percentage}%`;
});

// 圆形进度条相关计算
const relativeStrokeWidth = computed(() => (props.strokeWidth / props.width) * 100); // 相对于viewBox的strokeWidth
const radius = computed(() => 50 - relativeStrokeWidth.value / 2); // 圆环的半径
const circumference = computed(() => 2 * Math.PI * radius.value); // 圆环的周长
const strokeDashoffset = computed(() => (circumference.value * (100 - props.percentage)) / 100); // 进度圆环的偏移量

// 轨道颜色
const trackColor = "#e5e5e5";

// 进度条颜色
const strokeColor = computed(() => {
    if (props.color) {
        return props.color;
    }

    const colorMap = {
        primary: "#007bff",
        success: "#5eb85e",
        warning: "#e6914d",
        danger: "#d64545",
        info: "#36b5b5",
        purple: "#801eff",
        pink: "#FF69B4",
        gray: "#6b6b6b"
    };

    return colorMap[props.variant] || colorMap.primary;
});
</script>

<style lang="scss" scoped>
.progress {
    position: relative;
    width: 100%;

    // 线性进度条
    .progress-line {
        display: flex;
        align-items: center;
        width: 100%;
        .progress-line__outer {
            flex: 1;
            border-radius: 100px;
            overflow: hidden;
            position: relative;
            width: 100%;
            .progress-line__inner {
                height: 100%;
                border-radius: inherit;
                transition: width 0.6s ease;
                position: relative;
                overflow: hidden;
                &::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                }
                &.progress-line__inner--animated::after {
                    background-image: linear-gradient(
                        -45deg,
                        rgba(255, 255, 255, 0.2) 25%,
                        transparent 25%,
                        transparent 50%,
                        rgba(255, 255, 255, 0.2) 50%,
                        rgba(255, 255, 255, 0.2) 75%,
                        transparent 75%,
                        transparent
                    );
                    background-size: 20px 20px;
                    animation: progress-stripes 1s linear infinite;
                }
            }
        }
        .progress-line__text {
            flex-shrink: 0;
            margin-left: 10px;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
        }
    }

    // 圆形进度条
    &-circle {
        position: relative;
        display: inline-block;

        &__path {
            transition: stroke-dashoffset 0.6s ease;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
        }

        &__text {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 14px;
            font-weight: 600;
            color: #606266;
        }
    }

    // 颜色变体 - 参照Button配色
    &--primary .progress-line__inner {
        background-color: #007bff;
    }
    &--success .progress-line__inner {
        background-color: #5eb85e;
    }
    &--warning .progress-line__inner {
        background-color: #e6914d;
    }
    &--danger .progress-line__inner {
        background-color: #d64545;
    }
    &--info .progress-line__inner {
        background-color: #36b5b5;
    }
    &--purple .progress-line__inner {
        background-color: #801eff;
    }
    &--pink .progress-line__inner {
        background-color: #ff69b4;
    }
    &--gray .progress-line__inner {
        background-color: #6b6b6b;
    }
}

// 动画效果
@keyframes progress-stripes {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 20px 0;
    }
}
</style>
