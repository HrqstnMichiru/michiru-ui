<template>
    <span class="number-animation">
        <slot :value="displayValue">{{ displayValue }}</slot>
    </span>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { MNumberAnimationEasing, MNumberAnimationEmits, MNumberAnimationInstance, MNumberAnimationProps } from "./types";

defineOptions({
    name: "MNumberAnimation"
});
const props = withDefaults(defineProps<MNumberAnimationProps>(), {
    from: 0,
    duration: 1200,
    decimals: 0,
    prefix: "",
    suffix: "",
    easing: "easeOutCubic",
    autoplay: true,
    useGrouping: true
});
const emits = defineEmits<MNumberAnimationEmits>();

let rafId = 0;
const currentValue = ref<number>(props.from ?? 0);
const displayValue = computed(() => formatNumber(currentValue.value));
const easingMap: Record<MNumberAnimationEasing, (t: number) => number> = {
    linear: t => t, // 匀速
    easeOutCubic: t => 1 - Math.pow(1 - t, 3), // 快速开始，慢速结束
    easeOutQuad: t => 1 - (1 - t) * (1 - t), // 快速开始，慢速结束
    easeInOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) // 慢速开始和结束，中间加速
};

const formatNumber = (value: number) => {
    const fixed = value.toFixed(props.decimals);
    if (!props.useGrouping) {
        return `${props.prefix}${fixed}${props.suffix}`; // 不使用千分位分隔符，直接返回格式化后的字符串
    }
    const [intPart = "0", decimalPart] = fixed.split(".");
    const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 添加千分位分隔符
    const combined = decimalPart ? `${withSep}.${decimalPart}` : withSep;
    return `${props.prefix}${combined}${props.suffix}`;
};
const stop = () => {
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
    }
};
const start = () => {
    const fromValue = props.from ?? currentValue.value;
    animateTo(fromValue, props.value);
};
const animateTo = (fromValue: number, toValue: number) => {
    stop(); // 停止当前动画
    if (props.duration <= 0) {
        // 如果持续时间为0或负数，直接跳到目标值
        currentValue.value = toValue;
        emits("finish");
        return;
    }
    const start = performance.now(); // 获取动画开始时间
    const easing = easingMap[props.easing]; // 获取缓动函数
    const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / props.duration, 1); // 计算进度，确保不超过1
        const eased = easing(progress);
        currentValue.value = fromValue + (toValue - fromValue) * eased;
        if (progress < 1) {
            rafId = requestAnimationFrame(step);
        } else {
            currentValue.value = toValue;
            emits("finish");
        }
    };
    rafId = requestAnimationFrame(step);
};

// 监听 value 变化，触发动画
watch(
    () => props.value,
    (next, prev) => {
        if (!props.autoplay) {
            currentValue.value = next;
            return;
        }
        const fromValue = Number.isFinite(prev) ? prev : currentValue.value;
        animateTo(fromValue, next);
    }
);

// 监听 from 变化，如果 autoplay 关闭，直接更新 currentValue
watch(
    () => props.from,
    next => {
        if (!props.autoplay) {
            currentValue.value = next ?? 0;
        }
    }
);

defineExpose<MNumberAnimationInstance>({
    start,
    stop
});

onMounted(() => {
    if (props.autoplay) {
        start();
    } else {
        currentValue.value = props.from ?? 0;
    }
});

onBeforeUnmount(() => {
    stop();
});
</script>

<style lang="scss" scoped>
.number-animation {
    display: inline-flex;
    align-items: center;
    font-variant-numeric: tabular-nums; // 使用等宽数字字体，避免数字跳动
    letter-spacing: 0.2px;
    white-space: nowrap;
}
</style>
