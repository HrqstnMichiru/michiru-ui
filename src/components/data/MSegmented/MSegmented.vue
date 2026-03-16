<template>
    <div
        class="m-segmented"
        :class="[`m-segmented--${customSize}`, `m-segmented--${type}`, `m-segmented--${variant}`, { 'm-segmented--block': customBlock, 'm-segmented--disabled': disabled }]"
        :style="{
            gap: type !== 'default' ? `${gap}px` : undefined
        }">
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
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import { computed, inject, nextTick, onMounted, ref, watch } from "vue";
import type { MSegmentedEmits, MSegmentedOption, MSegmentedProps } from "./types";

defineOptions({
    name: "MSegmented"
});
const props = withDefaults(defineProps<MSegmentedProps>(), {
    type: "default",
    variant: "default",
    disabled: false,
    block: false,
    iconOnly: false,
    gap: 0
});
const emits = defineEmits<MSegmentedEmits>();
const modelValue = defineModel<string | number>("modelValue");
const itemRefs = ref<HTMLElement[]>([]);
const isAnimating = ref(false); // 是否正在动画中
const formItemContext = inject<MFormItemContext | null>(MFormItemContextKey, null);
const formContext = inject<MFormContext | null>(MFormContextKey, null);
const customSize = computed(() => {
    return props.size || formItemContext?.size || "medium";
});
const customBlock = computed(() => {
    return props.block || formItemContext?.block;
});

if (formItemContext && formItemContext.prop) {
    const initialValue = modelValue.value;
    formContext?.registerResetHandler(formItemContext.prop, () => {
        modelValue.value = initialValue;
        formItemContext?.resetValidate();
    });
}

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

const handleSelect = (option: MSegmentedOption) => {
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

onMounted(() => {
    nextTick(updateThumb);
});
watch(
    () => modelValue.value,
    () => nextTick(updateThumb)
);
watch(
    () => [props.type, props.gap, customSize.value, customBlock.value, props.iconOnly, props.options.length],
    () => nextTick(updateThumb)
);
</script>

<style lang="scss" scoped>
.m-segmented {
    --m-segmented-line-color: #801eff;
    --m-segmented-line-hover-color: #8b5cf6;
    position: relative;
    display: inline-flex;
    align-items: center;
    background: #f0f0f0;
    border-radius: 8px;
    padding: 3px;
    gap: 0;
    user-select: none;
    &.m-segmented--block {
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

    // 线条风格
    &.m-segmented--line,
    &.m-segmented--bar {
        padding: 0;
        border-radius: 0;
        background: transparent;
        .m-segmented__thumb {
            top: auto;
            height: 0;
            width: 0;
            border-radius: 0;
            background: transparent;
            border-bottom: 2px solid var(--m-segmented-line-color);
            box-shadow: none;
        }
        .m-segmented__item {
            border-radius: 0;
            color: #606266;
            font-weight: 500;
            &.is-active {
                color: var(--m-segmented-line-color);
            }
            &:not(.is-disabled):not(.is-active):hover {
                color: var(--m-segmented-line-hover-color);
            }
        }
    }

    &.m-segmented--line {
        border-bottom: 1px solid #e4e7ed;
        .m-segmented__thumb {
            bottom: -1px;
        }
    }

    &.m-segmented--bar {
        .m-segmented__thumb {
            bottom: 0;
        }
    }

    &.m-segmented--line.m-segmented--disabled,
    &.m-segmented--bar.m-segmented--disabled {
        opacity: 1;
        --m-segmented-line-color: #c0c4cc;
        --m-segmented-line-hover-color: #c0c4cc;
        .m-segmented__thumb {
            background: transparent;
            border-bottom-color: #c0c4cc;
        }
        .m-segmented__item {
            color: #a8abb2;
            &.is-active {
                color: #a8abb2;
            }
            &:not(.is-disabled):not(.is-active):hover {
                color: #a8abb2;
            }
        }
    }
    &.m-segmented--line.m-segmented--disabled {
        border-bottom-color: #e4e7ed;
    }

    // 颜色变体 - 滑块颜色 & 激活文字色
    @mixin variant-style($color) {
        .m-segmented__thumb {
            background: $color;
            box-shadow: 0 1px 6px rgba($color, 0.35);
        }
        .m-segmented__item.is-active {
            color: #fff;
        }
    }

    &:not(.m-segmented--line):not(.m-segmented--bar).m-segmented--primary {
        @include variant-style(#007bff);
    }
    &:not(.m-segmented--line):not(.m-segmented--bar).m-segmented--success {
        @include variant-style(#5eb85e);
    }
    &:not(.m-segmented--line):not(.m-segmented--bar).m-segmented--warning {
        @include variant-style(#e6a23c);
    }
    &:not(.m-segmented--line):not(.m-segmented--bar).m-segmented--danger {
        @include variant-style(#d64545);
    }
    &:not(.m-segmented--line):not(.m-segmented--bar).m-segmented--info {
        @include variant-style(#36b5b5);
    }
    &:not(.m-segmented--line):not(.m-segmented--bar).m-segmented--purple {
        @include variant-style(#801eff);
    }
    &:not(.m-segmented--line):not(.m-segmented--bar).m-segmented--pink {
        @include variant-style(#ff69b4);
    }

    &.m-segmented--primary {
        --m-segmented-line-color: #007bff;
        --m-segmented-line-hover-color: #0d6efd;
    }
    &.m-segmented--success {
        --m-segmented-line-color: #5eb85e;
        --m-segmented-line-hover-color: #70c670;
    }
    &.m-segmented--warning {
        --m-segmented-line-color: #e6a23c;
        --m-segmented-line-hover-color: #ebb563;
    }
    &.m-segmented--danger {
        --m-segmented-line-color: #d64545;
        --m-segmented-line-hover-color: #e25656;
    }
    &.m-segmented--info {
        --m-segmented-line-color: #36b5b5;
        --m-segmented-line-hover-color: #47c3c3;
    }
    &.m-segmented--purple {
        --m-segmented-line-color: #801eff;
        --m-segmented-line-hover-color: #8f5eff;
    }
    &.m-segmented--pink {
        --m-segmented-line-color: #ff69b4;
        --m-segmented-line-hover-color: #ff85c7;
    }
}
</style>
