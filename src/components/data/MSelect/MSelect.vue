<template>
    <MTooltip
        ref="tooltipRef"
        @visible-change="onVisibleChange"
        trigger="click"
        transition="translate"
        :show-arrow="false"
        sync-width
        :placement="placement"
        :disabled="disabled"
        :block="customBlock"
        theme="light">
        <MInput
            ref="inputRef"
            type="text"
            readonly
            v-model="displayText"
            :is-empty="isEmpty"
            :clearable="clearable"
            :placeholder="placeholder"
            :disabled="disabled"
            :block="customBlock"
            :width="width"
            :prefix-icon="prefixIcon"
            :size="customSize"
            :border-always="borderAlways"
            :injected="false"
            @blur="handleBlur"
            @clear="handleClear">
            <template v-if="multiple" #prefix>
                <MTag v-for="([value, label], index) in displayLabels" :key="value" :text="label" variant="gray" closable :size="customSize" @close="onClose(value, index)" plain></MTag>
                <MTooltip transition="none" theme="light" :z-index="2000">
                    <MTag :text="`+${hiddenLabels.length}`" v-if="hiddenLabels.length > 0" :size="customSize" variant="gray" shape="circle"></MTag>
                    <template #content>
                        <div
                            class="m-select__popper"
                            :style="{
                                maxWidth: `${tooltipWidth}px`
                            }">
                            <MTag
                                variant="gray"
                                plain
                                closable
                                v-for="([value, label], index) in hiddenLabels"
                                :key="value"
                                :text="label"
                                @close="onClose(value, index + maxCount)"
                                :size="customSize"></MTag>
                        </div>
                    </template>
                </MTooltip>
            </template>
            <template #suffix>
                <MIcon
                    name="material-symbols:arrow-forward-ios"
                    class="open"
                    :class="{
                        active: isActive
                    }" />
            </template>
        </MInput>
        <template #content>
            <div class="m-select-options">
                <slot name="header" v-if="toggleValueMap.size > 0">
                    <div class="m-select-header" v-if="multiple && hasSelectAll">
                        <MCheckBox variant="primary" @update:model-value="toggleSelectAll" :model-value="selectAll"></MCheckBox>
                        <span>全选</span>
                    </div>
                </slot>
                <MScrollBar :max-height="maxHeight" :right="0">
                    <slot></slot>
                    <span v-if="toggleValueMap.size === 0" class="m-select-empty">暂无数据</span>
                </MScrollBar>
                <slot name="footer" v-if="toggleValueMap.size > 0"></slot>
            </div>
        </template>
    </MTooltip>
</template>

<script lang="ts" setup>
import type { MInputInstance, MTooltipInstance } from "@/components";
import { MCheckBox, MIcon, MInput, MScrollBar, MTag, MTooltip } from "@/components";
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import { computed, inject, provide, ref, shallowReactive, useTemplateRef } from "vue";
import type { MSelectContext, MSelectEmits, MSelectProps } from "./types";
import { MSelectContextKey } from "./types";

defineOptions({
    name: "MSelect"
});

const props = withDefaults(defineProps<MSelectProps>(), {
    placeholder: "请选择",
    hideAfterClick: true,
    width: 250,
    placement: "bottom",
    maxHeight: 300,
    maxCount: 3,
    tooltipWidth: 250
});
const emits = defineEmits<MSelectEmits>();

const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");
const inputRef = useTemplateRef<MInputInstance>("inputRef");
const isActive = ref<boolean>(false);
const modelValue = defineModel<string | number | Array<string | number>>("modelValue");
const selectValueMap = shallowReactive<Map<string | number, string>>(new Map());
const toggleValueMap = shallowReactive<Map<string | number, string>>(new Map());
const displayText = computed(() => {
    if (!props.multiple && modelValue.value) {
        return selectValueMap.get(modelValue.value as string | number);
    }
    return "";
});
const displayLabels = computed(() => {
    if (props.multiple) {
        if (props.maxCount && selectValueMap.size > props.maxCount) {
            return Array.from(selectValueMap).slice(0, props.maxCount);
        } else {
            return Array.from(selectValueMap);
        }
    }
    return [];
});
const hiddenLabels = computed(() => {
    if (props.multiple && props.maxCount && selectValueMap.size > props.maxCount) {
        return Array.from(selectValueMap).slice(props.maxCount);
    }
    return [];
});
const placeholder = computed(() => {
    if (props.multiple && selectValueMap.size > 0) {
        return "";
    }
    return props.placeholder;
});

const formItemContext = inject<MFormItemContext | null>(MFormItemContextKey, null);
const formContext = inject<MFormContext | null>(MFormContextKey, null);
const customSize = computed(() => {
    return props.size || formItemContext?.size || "medium";
});
const customBlock = computed(() => {
    return props.block || formItemContext?.block;
});
const isEmpty = computed(() => {
    if (props.multiple) {
        return selectValueMap.size === 0;
    } else {
        return !modelValue.value;
    }
});

const onVisibleChange = (visible: boolean) => {
    isActive.value = visible;
    if (visible) {
        inputRef.value?.focus();
    } else {
        inputRef.value?.blur();
    }
};

const selectAll = computed(() => {
    return toggleValueMap.size > 0 && selectValueMap.size === toggleValueMap.size;
});

const toggleSelectAll = () => {
    if (selectAll.value) {
        selectValueMap.clear();
        modelValue.value = [];
        emits("change");
    } else {
        toggleValueMap.forEach((value, label) => {
            selectValueMap.set(label, value);
        });
        const currentValues = Array.from(selectValueMap.keys());
        modelValue.value = currentValues;
        emits("change");
    }
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

const handleClearField = () => {
    selectValueMap.clear();
    if (props.multiple) {
        modelValue.value = [];
        emits("change");
    } else {
        modelValue.value = "";
        emits("change");
    }
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

const onClose = (value: string | number, index: number) => {
    selectValueMap.delete(value);
    const newLabels = [...(modelValue.value as string[])];
    newLabels.splice(index, 1);
    modelValue.value = newLabels;
    emits("change");
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

const handleClear = () => {
    handleClearField();
    tooltipRef.value?.show();
};

const handleBlur = () => {
    if (formItemContext && formItemContext.trigger === "blur") {
        formItemContext.validate();
    }
};

const isSelected = (value: string | number) => {
    return selectValueMap.has(value);
};

const setModelValue = (label: string, value: string | number, initial: boolean) => {
    if (props.multiple) {
        if (selectValueMap.has(value)) {
            selectValueMap.delete(value);
        } else {
            selectValueMap.set(value, label);
        }
        const currentValues = Array.from(selectValueMap.values());
        modelValue.value = currentValues;
        if (initial) return;
        emits("change");
        if (formItemContext && formItemContext.trigger === "change") {
            formItemContext.validate();
        }
    } else {
        if (selectValueMap.has(value)) {
            selectValueMap.delete(value);
            modelValue.value = "";
        } else {
            selectValueMap.clear();
            selectValueMap.set(value, label);
            modelValue.value = value;
        }
        if (initial) return;
        emits("change");
        if (formItemContext && formItemContext.trigger === "change") {
            formItemContext.validate();
        }
        if (props.hideAfterClick) {
            tooltipRef.value?.hide();
        }
    }
};

const register = (label: string, value: string | number) => {
    toggleValueMap.set(value, label);
};

provide<MSelectContext>(MSelectContextKey, {
    setModelValue,
    isSelected,
    register
});

(() => {
    selectValueMap.clear();
    if (props.multiple) {
        if (Array.isArray(modelValue.value)) {
            modelValue.value.forEach(value => {
                const label = toggleValueMap.get(value);
                selectValueMap.set(value, label!);
            });
        }
    } else {
        if (!modelValue.value || Array.isArray(modelValue.value)) return;
        const label = toggleValueMap.get(modelValue.value);
        selectValueMap.set(modelValue.value, label!);
    }
    if (formItemContext && formItemContext.prop) {
        formContext?.registerResetHandler(formItemContext.prop, () => {
            handleClearField();
            formItemContext?.resetValidate();
        });
    }
})();
</script>

<style lang="scss" scoped>
.m-select-options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: fit-content;
    padding: 4px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
    .m-select-header {
        padding: 6px 10px;
        gap: 8px;
        font-size: 15px;
        font-weight: 500;
        margin: 0 -3px;
        margin-bottom: 3px;
        border-bottom: 1px solid rgb(220, 223, 230);
        display: flex;
        align-items: center;
    }
    .m-select-empty {
        display: block;
        padding: 5px;
        font-size: 14px;
        text-align: center;
        color: #a8abb2;
    }
}

.open {
    transition: transform 0.3s ease-in-out;
    transform: rotate(90deg);
    &.active {
        transform: rotate(270deg);
    }
}

.m-select__popper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px;
    width: max-content;
    padding: 8px 12px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
}
</style>
