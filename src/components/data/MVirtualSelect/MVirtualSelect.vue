<template>
    <MTooltip
        ref="tooltipRef"
        @visible-change="visibleChange"
        trigger="click"
        sync-width
        transition="translate"
        :show-arrow="false"
        :placement="placement"
        :disabled="disabled"
        :block="customBlock"
        theme="light">
        <MInput
            type="text"
            readonly
            ref="inputRef"
            v-model="displayText"
            :clearable="clearable"
            :placeholder="placeholder"
            :disabled="disabled"
            :block="customBlock"
            :width="width"
            :prefix-icon="prefixIcon"
            :size="customSize"
            :border-always="borderAlways"
            :injected="false"
            :is-empty="isEmpty"
            @blur="handleBlur"
            @clear="handleClear">
            <template v-if="multiple" #prefix>
                <MTag v-for="([value, label], index) in displayLabels" :key="value" :text="label" variant="gray" closable :size="customSize" @close="onClose(value, index)"></MTag>
                <MTooltip transition="none" theme="light" :z-index="2000">
                    <MTag :text="`+${hiddenLabels.length}`" v-if="hiddenLabels.length > 0" :size="customSize" variant="gray" shape="circle"></MTag>
                    <template #content>
                        <div
                            class="m-virtual-select__popper"
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
            <div class="m-virtual-select-options">
                <template v-if="dataSource.length > 0">
                    <slot name="header">
                        <div class="m-virtual-select-header" v-if="multiple && hasSelectAll">
                            <MCheckBox variant="primary" @update:model-value="() => toggleSelectAll()" :model-value="selectAll"></MCheckBox>
                            <span>全选</span>
                        </div>
                    </slot>
                    <MVirtualList :data-source="dataSource" :item-height="itemHeight" :buffer-size="bufferSize" :max-count="maxCount">
                        <template #default="{ item }">
                            <div
                                class="m-virtual-select-option"
                                @click="onClick(item.label, item.value)"
                                :class="{
                                    'is-disabled': disabled,
                                    'is-checked': isSelected(item.value)
                                }">
                                <slot :label="item.label" :value="item.value">
                                    <span class="label">{{ item.label }}</span>
                                    <MIcon name="material-symbols:check-rounded" class="check" v-if="isSelected(item.value)"></MIcon>
                                </slot>
                            </div>
                        </template>
                    </MVirtualList>
                    <slot name="footer"></slot>
                </template>
                <template v-else>
                    <span class="m-virtual-select-empty">鏆傛棤鏁版嵁</span>
                </template>
            </div>
        </template>
    </MTooltip>
</template>

<script lang="ts" setup>
import type { MInputInstance, MTooltipInstance } from "@/components";
import { MCheckBox, MIcon, MInput, MTag, MTooltip, MVirtualList } from "@/components";
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import type { MSelectEmits } from "@/components/data/MSelect/types";
import { computed, inject, onMounted, ref, shallowReactive, useTemplateRef } from "vue";
import type { MVirtualSelectProps } from "./types";

defineOptions({
    name: "MVirtualSelect"
});
const props = withDefaults(defineProps<MVirtualSelectProps>(), {
    placeholder: "请选择",
    hideAfterClick: true,
    width: 250,
    placement: "bottom",
    itemHeight: 36,
    bufferSize: 5,
    maxCount: 6,
    tooltipMaxCount: 3,
    tooltipWidth: 250,
    size: "medium",
    dataSource: () => []
});
const emits = defineEmits<MSelectEmits>();

const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");
const inputRef = useTemplateRef<MInputInstance>("inputRef");
const isActive = ref<boolean>(false);
const modelValue = defineModel<string | number | Array<string | number>>("modelValue");
const selectValueMap = shallowReactive<Map<string | number, string>>(new Map());
const displayText = computed(() => {
    if (!props.multiple && modelValue.value) {
        return selectValueMap.get(modelValue.value as string | number);
    }
    return "";
});
const displayLabels = computed(() => {
    if (props.multiple) {
        if (props.tooltipMaxCount && selectValueMap.size > props.tooltipMaxCount) {
            return Array.from(selectValueMap).slice(0, props.tooltipMaxCount);
        } else {
            return Array.from(selectValueMap);
        }
    }
    return [];
});
const hiddenLabels = computed(() => {
    if (props.multiple && props.tooltipMaxCount && selectValueMap.size > props.tooltipMaxCount) {
        return Array.from(selectValueMap).slice(props.tooltipMaxCount);
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

const selectAll = computed(() => {
    return props.dataSource.length > 0 && selectValueMap.size === props.dataSource.length;
});
const toggleSelectAll = () => {
    if (selectAll.value) {
        selectValueMap.clear();
        modelValue.value = [];
        emits("change");
        if (formItemContext && formItemContext.trigger === "change") {
            formItemContext.validate();
        }
    } else {
        props.dataSource.forEach(item => {
            selectValueMap.set(item.value, item.label);
        });
        const currentValues = Array.from(selectValueMap.keys());
        modelValue.value = currentValues;
        emits("change");
        if (formItemContext && formItemContext.trigger === "change") {
            formItemContext.validate();
        }
    }
};

const visibleChange = (visible: boolean) => {
    isActive.value = visible;
    if (visible) {
        inputRef.value?.focus();
    } else {
        inputRef.value?.blur();
    }
};

const handleClearField = () => {
    selectValueMap.clear(); // 清空选中值
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
const handleClear = () => {
    handleClearField();
    tooltipRef.value?.show();
};

const handleBlur = () => {
    if (formItemContext && formItemContext.trigger === "blur") {
        formItemContext.validate();
    }
};

const onClick = (label: string, value: string | number) => {
    if (props.multiple) {
        if (selectValueMap.has(value)) {
            selectValueMap.delete(value);
        } else {
            selectValueMap.set(value, label);
        }
        const currentValues = Array.from(selectValueMap.values());
        modelValue.value = currentValues;
        emits("change");
    } else {
        if (selectValueMap.has(value)) {
            selectValueMap.delete(value);
            modelValue.value = "";
        } else {
            selectValueMap.clear();
            selectValueMap.set(value, label);
            modelValue.value = value;
        }
        emits("change");
        if (props.hideAfterClick) {
            tooltipRef.value?.hide();
        }
    }
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

const isSelected = (value: string | number) => {
    return selectValueMap.has(value);
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

(() => {
    selectValueMap.clear();
    props.dataSource.forEach(item => {
        if (props.multiple) {
            if (Array.isArray(modelValue.value) && modelValue.value.includes(item.value)) {
                selectValueMap.set(item.value, item.label);
            }
        } else {
            if (modelValue.value === item.value) {
                selectValueMap.set(item.value, item.label);
            }
        }
    });
    if (formItemContext && formItemContext.prop) {
        formContext?.registerResetHandler(formItemContext.prop, () => {
            handleClearField();
            formItemContext?.resetValidate();
        });
    }
})();
</script>

<style lang="scss" scoped>
.m-virtual-select-options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4px;
    background-color: #fff;
    border-radius: 6px;
    position: relative;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
    .m-virtual-select-header {
        padding: 6px 10px;
        font-size: 15px;
        gap: 8px;
        font-weight: 500;
        margin: 0 -3px;
        margin-bottom: 3px;
        border-bottom: 1px solid rgb(220, 223, 230);
        display: flex;
        align-items: center;
    }
    .m-virtual-select-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        .label {
            flex: 1;
            font-size: 15px;
            font-weight: 500;
            color: rgb(96, 98, 102);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: all 0.2s ease;
        }
        .check {
            flex-shrink: 0;
            font-size: 20px;
            color: rgb(41, 52, 61);
            opacity: 0.75;
            transition: all 0.2s ease;
        }
        &:hover {
            background-color: rgba(0, 0, 0, 0.08);
        }
        &.is-disabled {
            cursor: not-allowed;
            color: #a8abb2;
            &:hover {
                color: #a8abb2;
            }
        }
        &.is-checked {
            .label {
                color: #801eff;
                font-weight: 500;
            }
            .check {
                color: #801eff;
                opacity: 1;
            }
        }
    }
    .m-virtual-select-empty {
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

.m-virtual-select__popper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    width: max-content;
    padding: 8px 12px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
}
</style>
