<template>
    <div
        class="timeline-item"
        :class="{
            [`timeline-item--${timelineContext?.mode}`]: timelineContext?.mode,
            'timeline-item--disabled': disabled
        }">
        <!-- 时间轴点 -->
        <div class="timeline-item-dot" :style="dotStyle">
            <div
                class="timeline-dot"
                :class="{
                    [`timeline-dot--${colorClass}`]: colorClass,
                    'timeline-dot--hollow': hollow
                }"></div>
        </div>

        <!-- 时间轴线 -->
        <div class="timeline-item-line" :style="lineStyle"></div>

        <!-- 内容区域 -->
        <div
            class="timeline-item-content"
            :style="{
                flex: block ? 1 : undefined
            }">
            <!-- 时间戳（顶部） -->
            <div v-if="timestamp && timelineContext?.timestampPosition === 'top'" class="timeline-item-timestamp timeline-item-timestamp--top">
                {{ timestamp }}
            </div>

            <!-- 主要内容 -->
            <slot></slot>

            <!-- 时间戳（底部） -->
            <div v-if="timestamp && timelineContext?.timestampPosition === 'bottom'" class="timeline-item-timestamp timeline-item-timestamp--bottom">
                {{ timestamp }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import type { MTimelineContext, MTimelineItemProps } from "./types";
import { MTimelineContextKey } from "./types";

defineOptions({
    name: "MTimelineItem"
});

const props = withDefaults(defineProps<MTimelineItemProps>(), {
    color: "primary",
    last: false,
    first: false,
    dot: false,
    disabled: false,
    hollow: false
});
const timelineContext = inject<MTimelineContext>(MTimelineContextKey);

const colorMap: Record<string, string> = {
    primary: "primary",
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "info"
};
const colorClass = computed(() => {
    return colorMap[props.color] || "custom";
});

const dotStyle = computed(() => {
    if (colorClass.value === "custom") {
        return {
            "--custom-color": props.color
        };
    }
    return {};
});

const lineStyle = computed(() => {
    if (colorClass.value === "custom") {
        return {
            "--line-color": props.color
        };
    }
    return {};
});
</script>

<style lang="scss" scoped>
.timeline-item.timeline-item--alternate:nth-child(odd) .timeline-item-content {
    margin-right: 16px !important;
}

.timeline-item.timeline-item--alternate:nth-child(even) .timeline-item-content {
    margin-left: 16px !important;
}

.timeline-item {
    position: relative;
    display: flex;
    padding-bottom: 20px;

    // 最后一个元素去掉下边距
    &:last-child {
        padding-bottom: 0;
    }

    // 禁用状态
    &.timeline-item--disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .timeline-item-content {
        margin-left: 16px;
        .timeline-item-timestamp {
            font-size: 12px;
            color: #6b7280;
            font-weight: 400;
            &--top {
                margin-bottom: 4px;
            }
            &--bottom {
                margin-top: 4px;
            }
        }
    }

    &.timeline-item--left {
        align-items: flex-start;
        .timeline-item-line {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 2px;
            background-color: #c8c9cb;
            z-index: 0;
            left: 7px;
            // 自定义颜色
            &[style*="--line-color"] {
                background-color: var(--line-color);
                opacity: 0.3;
            }
        }
        &:last-child .timeline-item-line {
            display: none;
        }
    }

    &.timeline-item--alternate {
        position: relative;
        align-items: flex-start;
        // 中央时间轴线
        &::before {
            content: "";
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background-color: #e5e7eb;
            transform: translateX(-50%);
            z-index: 0;
        }
        &:last-child::before {
            display: none;
        }
        &:nth-child(odd) {
            flex-direction: row-reverse;
            padding-right: calc(50% - 8px);
            text-align: right;
        }
        &:nth-child(even) {
            flex-direction: row;
            padding-left: calc(50% - 8px);
        }
    }

    // 时间轴点
    .timeline-item-dot {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        z-index: 1;
        .timeline-dot {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: #ffffff;
            border: 3px solid #fff;
            transition: all var(--animation-3s);
            font-size: 16px;
            width: 16px;
            height: 16px;

            // 颜色变体
            &.timeline-dot--primary {
                border-color: #801eff;
                background-color: #801eff;
                color: #ffffff;

                &.timeline-dot--hollow {
                    background-color: #ffffff;
                    color: #801eff;
                }
            }

            &.timeline-dot--success {
                border-color: #10b981;
                background-color: #10b981;
                color: #ffffff;

                &.timeline-dot--hollow {
                    background-color: #ffffff;
                    color: #10b981;
                }
            }

            &.timeline-dot--warning {
                border-color: #e6a23c;
                background-color: #e6a23c;
                color: #ffffff;

                &.timeline-dot--hollow {
                    background-color: #ffffff;
                    color: #e6a23c;
                }
            }

            &.timeline-dot--danger {
                border-color: #ef4444;
                background-color: #ef4444;
                color: #ffffff;

                &.timeline-dot--hollow {
                    background-color: #ffffff;
                    color: #ef4444;
                }
            }

            &.timeline-dot--info {
                border-color: #3b82f6;
                background-color: #3b82f6;
                color: #ffffff;

                &.timeline-dot--hollow {
                    background-color: #ffffff;
                    color: #3b82f6;
                }
            }

            &.timeline-dot--custom {
                border-color: var(--custom-color, #801eff);
                background-color: var(--custom-color, #801eff);
                color: #ffffff;

                &.timeline-dot--hollow {
                    background-color: #ffffff;
                    color: var(--custom-color, #801eff);
                }
            }
        }
    }
}
</style>
