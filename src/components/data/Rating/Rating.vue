<template>
    <div class="m-rating" :class="{ 'm-rating--disabled': disabled, 'm-rating--readonly': readonly }">
        <!-- 文字或分数显示 -->
        <span class="m-rating__text" :style="{ color }">
            {{ displayValue.toFixed(1) }}
        </span>
        <!-- 星星评分 -->
        <div class="m-rating__stars">
            <div v-for="n in 5" :key="n" class="m-rating__star-wrapper" @mouseleave="handleMouseLeave">
                <MIcon :name="getStarIcon(n)" :size="20" class="m-rating__star" :style="{ color: getStarColor(n) }"></MIcon>
                <!-- 半星点击区域 -->
                <span class="m-rating__half-area" @mouseenter="handleMouseEnter((n - 1) * 2 + 1)" @click="handleHalfStarClick(n)"></span>
                <!-- 满星点击区域 -->
                <span class="m-rating__full-area" @mouseenter="handleMouseEnter(n * 2)" @click="handleFullStarClick(n)"></span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormContext, FormItemContext } from "@/components";
import { FormContextKey, FormItemContextKey, MIcon } from "@/components";
import { computed, inject, onMounted, ref } from "vue";
import type { RatingEmits, RatingProps } from "./types";

defineOptions({
    name: "MRating"
});

const props = withDefaults(defineProps<RatingProps>(), {
    color: "#f59e0b",
    rate: 0
});
const emits = defineEmits<RatingEmits>();
const formItemContext = inject<FormItemContext | null>(FormItemContextKey, null);
const formContext = inject<FormContext | null>(FormContextKey, null);

const currentValue = defineModel<number>("modelValue", { default: 0 });
const hoverValue = ref(0); // 悬停时的值
const isHovering = ref(false); // 是否处于悬停状态
const displayValue = computed(() => {
    return isHovering.value ? hoverValue.value : currentValue.value || props.rate;
});

const disabledVoidColor = "#c0c4cc"; // 禁用时的颜色
const voidColor = "#e5e7eb"; // 未激活时的颜色

// 获取星星图标
const getStarIcon = (starPosition: number) => {
    const starValue = (starPosition - 1) * 2; // 每颗星代表2分
    if (displayValue.value >= starValue + 2) {
        return "bi:star-fill"; // 满星
    } else if (displayValue.value >= starValue + 1) {
        return "bi:star-half"; // 半星
    } else {
        return "bi:star"; // 空星
    }
};

// 获取星星颜色
const getStarColor = (starPosition: number) => {
    const starValue = (starPosition - 1) * 2;
    const isActive = displayValue.value > starValue;
    if (props.disabled) {
        return isActive ? disabledVoidColor : voidColor;
    }
    return isActive ? "#f59e0b" : voidColor;
};

// 鼠标进入处理
const handleMouseEnter = (value: number) => {
    if (props.disabled || props.readonly) return;

    isHovering.value = true;
    hoverValue.value = value;
};

// 鼠标离开处理
const handleMouseLeave = () => {
    if (props.disabled || props.readonly) return;

    isHovering.value = false;
    hoverValue.value = 0;
};

// 满星点击处理
const handleFullStarClick = (starPosition: number) => {
    if (props.disabled || props.readonly) return;

    const newValue = starPosition * 2; // 满星值

    // 如果可清空且点击的是当前值，则清空
    if (props.clearable && newValue === currentValue.value) {
        updateValue(0);
        return;
    }

    updateValue(newValue);
};

// 半星点击处理
const handleHalfStarClick = (starPosition: number) => {
    if (props.disabled || props.readonly) return;

    const newValue = (starPosition - 1) * 2 + 1; // 半星值

    // 如果可清空且点击的是当前值，则清空
    if (props.clearable && newValue === currentValue.value) {
        updateValue(0);
        return;
    }

    updateValue(newValue);
};

// 更新值
const updateValue = (value: number) => {
    currentValue.value = value;
    emits("change");
};

onMounted(() => {
    // 注册到表单项
    if (formItemContext && formItemContext.prop) {
        formContext?.registerResetHandler(formItemContext.prop, () => {
            currentValue.value = 0;
            formItemContext?.resetValidate();
        });
    }
});
</script>

<style lang="scss" scoped>
.m-rating {
    display: flex;
    align-items: baseline;
    user-select: none;
    .m-rating__text {
        text-align: center;
        width: 85px;
        font-size: 40px;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
    }
    .m-rating__stars {
        display: flex;
        align-items: center;
        .m-rating__star-wrapper {
            position: relative;
            display: inline-block;
            transition: all 0.2s ease;
            &:hover {
                transform: scale(1.1);
            }
            .m-rating__star {
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 0;
            }
            .m-rating__half-area {
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                height: 100%;
                cursor: pointer;
                z-index: 1;
            }
            .m-rating__full-area {
                position: absolute;
                top: 0;
                right: 0;
                width: 50%;
                height: 100%;
                cursor: pointer;
                z-index: 1;
            }
        }
    }

    // 禁用状态样式
    &.m-rating--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        .m-rating__star-wrapper {
            pointer-events: none;
            &:hover {
                transform: none;
            }
        }
    }

    // 只读状态样式
    &.m-rating--readonly {
        .m-rating__star-wrapper {
            pointer-events: none;
            &:hover {
                transform: none;
            }
        }
    }
}
</style>
