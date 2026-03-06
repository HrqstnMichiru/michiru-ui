<template>
    <div class="statistic" :class="[variant ? `statistic--${variant}` : '']">
        <div class="statistic__main">
            <span class="statistic__title">
                {{ title }}
            </span>
            <div class="statistic__content">
                <div class="statistic__value">
                    <span v-if="prefix" class="statistic__prefix">{{ prefix }}</span>
                    <MNumberAnimation :value="value" :decimals="precision" @finish="handleAnimationEnd" :duration="duration" />
                    <span v-if="suffix" class="statistic__suffix">{{ suffix }}</span>
                </div>
                <!-- 瓒嬪娍閮ㄥ垎 -->
                <div class="statistic__trend" :class="`statistic__trend--${trendType}`">
                    <MIcon :name="trendIcon"></MIcon>
                    <span class="statistic__trend-text">
                        {{ trendText }}
                    </span>
                </div>
            </div>
        </div>
        <!-- 鍙充晶鍥炬爣 -->
        <div v-if="icon" class="statistic__icon">
            <MIcon :name="icon" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon, MNumberAnimation } from "@/components";
import { computed } from "vue";
import type { StatisticEmits, StatisticProps } from "./types";

defineOptions({
    name: "MStatistic"
});
const props = withDefaults(defineProps<StatisticProps>(), {
    precision: 0,
    duration: 1200,
    trendPrefix: "上周",
    variant: "primary"
});
const { variant } = props;
const emits = defineEmits<StatisticEmits>();

const trendIcon = computed(() => {
    switch (props.trendType) {
        case "up":
            return "material-symbols:arrow-upward";
        case "down":
            return "material-symbols:arrow-downward";
        case "unchanged":
            return "minus";
        default:
            return "minus";
    }
});

const trendText = computed(() => {
    switch (props.trendType) {
        case "up":
            return `较${props.trendPrefix}增长${props.trendValue}`;
        case "down":
            return `较${props.trendPrefix}下降${props.trendValue}`;
        case "unchanged":
            return `较${props.trendPrefix}无变化`;
        default:
            return "";
    }
});

const handleAnimationEnd = () => {
    emits("animation-end");
};
</script>

<style lang="scss" scoped>
.statistic {
    position: relative;
    border-radius: 8px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, #faf5ff 0%, #fef3f2 50%, #f0f9ff 100%);
    .statistic__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        font-size: 32px;
        flex-shrink: 0;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
    }
    &.statistic--primary .statistic__icon {
        color: #409eff;
        background: #d9ecff;
    }
    &.statistic--success .statistic__icon {
        color: #67c23a;
        background: #e1f3d8;
    }
    &.statistic--warning .statistic__icon {
        color: #e6a23c;
        background: #faecd8;
    }
    &.statistic--danger .statistic__icon {
        color: #f56c6c;
        background: #fde2e2;
    }
    &.statistic--info .statistic__icon {
        color: #17a2b8;
        background: #d4f0f5;
    }
    .statistic__main {
        display: flex;
        flex-direction: column;
        flex: 1;
        .statistic__title {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 14px;
            color: #6b7280;
            font-weight: 400;
        }
        .statistic__content {
            display: flex;
            flex-direction: column;
            .statistic__value {
                display: flex;
                align-items: baseline;
                font-size: 32px;
                font-weight: 600;
                color: #111827;
                line-height: 1;
                margin-bottom: 8px;
                .statistic__prefix,
                .statistic__suffix {
                    font-size: 20px;
                    color: #6b7280;
                }
                .statistic__prefix {
                    margin-right: 4px;
                }

                .statistic__suffix {
                    margin-left: 4px;
                }
            }
            .statistic__trend {
                display: flex;
                align-items: center;
                font-size: 13px;
                line-height: 1;
                &.statistic__trend--up {
                    color: #10b981;
                }
                &.statistic__trend--down {
                    color: #ef4444;
                }
                &.statistic__trend--unchanged {
                    color: #6b7280;
                }
            }
        }
    }
}
</style>
