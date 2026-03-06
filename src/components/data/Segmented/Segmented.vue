<template>
    <div class="m-segmented" :class="[`m-segmented--${size}`, `m-segmented--${variant}`, { 'm-segmented--block': block, 'm-segmented--disabled': disabled }]">
        <!-- 滑块 -->
        <div class="m-segmented__thumb" :style="thumbStyle"></div>
        <!-- 选项 -->
        <div
            v-for="option in options"
            :key="option.value"
            ref="itemRefs"
            class="m-segmented__item"
            :class="{
                'is-active': modelValue === option.value,
                'is-disabled': option.disabled || disabled
            }"
            @click="handleSelect(option)">
            <MIcon v-if="option.icon" :name="option.icon" class="m-segmented__icon" />
            <span v-if="!iconOnly || !option.icon">{{ option.label }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { nextTick, onMounted, ref, watch } from "vue";
import type { SegmentedEmits, SegmentedOption, SegmentedProps } from "./types";

defineOptions({
    name: "MSegmented"
});
const props = withDefaults(defineProps<SegmentedProps>(), {
    size: "medium",
    variant: "default",
    disabled: false,
    block: false,
    iconOnly: false
});
const emits = defineEmits<SegmentedEmits>();
const modelValue = defineModel<string | number>("modelValue");
const itemRefs = ref<HTMLElement[]>([]);
const isAnimating = ref(false); // 是否正在动画中

// 滑块位置与尺寸
const thumbStyle = ref({ left: "0px", width: "0px", opacity: "0" });
const updateThumb = () => {
    const idx = props.options.findIndex(o => o.value === modelValue.value);
    if (idx === -1 || !itemRefs.value[idx]) {
        thumbStyle.value.opacity = "0";
        return;
    }
    const el = itemRefs.value[idx];
    thumbStyle.value = {
        left: `${el.offsetLeft}px`,
        width: `${el.offsetWidth}px`,
        opacity: "1"
    };
};

const handleSelect = (option: SegmentedOption) => {
    if (isAnimating.value) return; // 如果正在动画中，禁止选择
    if (option.disabled || props.disabled) return; // 如果选项或组件被禁用，禁止选择
    if (option.value === modelValue.value) return; // 如果选择当前已选项，不做任何操作
    modelValue.value = option.value;
    isAnimating.value = true;
    emits("change");
    setTimeout(() => {
        isAnimating.value = false;
    }, 300); // 300ms是动画时长，应该和CSS中的一致
};

onMounted(() => nextTick(updateThumb));
watch(
    () => modelValue.value,
    () => nextTick(updateThumb)
);
</script>

<style lang="scss" scoped>
.m-segmented {
    position: relative;
    display: inline-flex;
    align-items: center;
    background: #f0f0f0;
    border-radius: 8px;
    padding: 3px;
    gap: 0;
    user-select: none;
    &.m-egmented--block {
        display: flex;
        width: 100%;
        .m-segmented__item {
            flex: 1;
        }
    }

    &.m-segmented--disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    // 尺寸
    &.m-segmented--small .m-segmented__item {
        padding: 6px 10px;
        font-size: 12px;
        height: 24px;
        .m-segmented__icon {
            font-size: 15px;
        }
    }
    &.m-segmented--medium .m-segmented__item {
        padding: 8px 14px;
        font-size: 14px;
        height: 30px;
        .m-segmented__icon {
            font-size: 16px;
        }
    }
    &.m-segmented--large .m-segmented__item {
        padding: 10px 18px;
        font-size: 16px;
        height: 36px;
        .m-segmented__icon {
            font-size: 18px;
        }
    }

    // 滑块
    .m-segmented__thumb {
        position: absolute;
        top: 3px;
        bottom: 3px;
        border-radius: 6px;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
        transition:
            left 0.3s cubic-bezier(0.35, 0, 0.25, 1),
            width 0.3s cubic-bezier(0.35, 0, 0.25, 1),
            opacity 0.3s ease;
        pointer-events: none;
        z-index: 0;
    }

    // 选项
    .m-segmented__item {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        border-radius: 6px;
        cursor: pointer;
        color: #666;
        font-weight: 400;
        transition: color 0.3s ease;
        white-space: nowrap;

        &.is-active {
            color: #111;
            font-weight: 500;
        }

        &.is-disabled {
            cursor: not-allowed;
            opacity: 0.4;
        }

        &:not(.is-disabled):not(.is-active):hover {
            color: #333;
        }

        .m-segmented__icon {
            flex-shrink: 0;
        }
    }

    // 颜色变体 - 滑块颜色 & 激活文字色
    @mixin variant-style($color, $text: #fff) {
        .m-segmented__thumb {
            background: $color;
            box-shadow: 0 1px 6px rgba($color, 0.35);
        }
        .m-segmented__item.is-active {
            color: $text;
        }
    }

    &.m-segmented--primary {
        @include variant-style(#007bff);
    }
    &.m-segmented--success {
        @include variant-style(#5eb85e);
    }
    &.m-segmented--warning {
        @include variant-style(#e6a23c);
    }
    &.m-segmented--danger {
        @include variant-style(#d64545);
    }
    &.m-segmented--info {
        @include variant-style(#36b5b5);
    }
    &.m-segmented--purple {
        @include variant-style(#801eff);
    }
    &.m-segmented--pink {
        @include variant-style(#ff69b4);
    }
}
</style>
