<template>
    <MTooltip ref="tooltipRef" @visible-change="onVisibleChange" trigger="click" transition="unfold" theme="light" :show-arrow="false" :placement="placement" :disabled="disabled" :block="customBlock">
        <Input
            type="text"
            readonly
            :injected="false"
            prefix-icon="material-symbols:calendar-month-outline"
            v-model="displayValue"
            :clearable="clearable"
            :placeholder="placeholder"
            :disabled="disabled"
            :width="width"
            :block="customBlock"
            :size="customSize"
            :border-always="borderAlways"
            :is-empty="isEmpty"
            @blur="handleBlur"
            @clear="handleClear">
            <template v-if="multiple" #prefix>
                <MTag v-for="(date, index) in displayDates" :key="date" :text="date" variant="gray" plain closable :size="customSize" @close="onClose(index)"></MTag>
                <MTooltip transition="none" theme="light" :z-index="2000">
                    <MTag :text="`+${hiddenDates.length}`" v-if="hiddenDates.length > 0" :size="customSize" variant="gray" shape="circle" plain></MTag>
                    <template #content>
                        <div
                            class="m-date-picker__popper"
                            :style="{
                                maxWidth: `${tooltipWidth}px`
                            }">
                            <MTag variant="gray" plain closable v-for="(tag, index) in hiddenDates" :key="index" :text="tag" @close="onClose(index + maxCount)" :size="customSize"></MTag>
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
        </Input>
        <template #content>
            <DatePickerPanel ref="panelRef" v-model="modelValue" :format="format" :multiple="multiple" @change="onChange" @click="onClick"></DatePickerPanel>
        </template>
    </MTooltip>
</template>

<script lang="ts" setup>
import type { FormContext, FormItemContext, MTooltipInstance } from "@/components";
import { FormContextKey, FormItemContextKey, MIcon, MTag, MTooltip } from "@/components";
import { computed, inject, onMounted, ref, useTemplateRef } from "vue";
import DatePickerPanel from "./DatePickerPanel.vue";
import type { DatePickerEmits, DatePickerPanelInstance, DatePickerProps } from "./types";

defineOptions({
    name: "MDatePicker"
});
const props = withDefaults(defineProps<DatePickerProps>(), {
    hideAfterClick: true,
    width: 250,
    placement: "bottom",
    format: "YYYY-MM-DD",
    size: "medium",
    block: false,
    borderAlways: false,
    maxCount: 2,
    placeholder: "请选择日期",
    tooltipWidth: 245
});
const emits = defineEmits<DatePickerEmits>();

const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");
const panelRef = useTemplateRef<DatePickerPanelInstance>("panelRef");
const modelValue = defineModel<string | string[]>("modelValue");
const isActive = ref<boolean>(false);
const displayValue = computed(() => {
    if (!props.multiple && modelValue.value) {
        return modelValue.value as string;
    }
    return "";
});
const displayDates = computed(() => {
    if (props.multiple) {
        if (props.maxCount && (modelValue.value as string[]).length > props.maxCount) {
            return (modelValue.value as string[]).slice(0, props.maxCount);
        } else {
            return modelValue.value as string[];
        }
    }
    return [];
});
const hiddenDates = computed(() => {
    if (props.multiple && props.maxCount && (modelValue.value as string[]).length > props.maxCount) {
        return (modelValue.value as string[]).slice(props.maxCount);
    }
    return [];
});
const placeholder = computed<string>(() => {
    if (props.multiple && (modelValue.value as string[]).length > 0) {
        return "";
    }
    return props.placeholder;
});

const formItemContext = inject<FormItemContext | null>(FormItemContextKey, null);
const formContext = inject<FormContext | null>(FormContextKey, null);
const customSize = computed(() => {
    return formItemContext?.size || props.size;
});
const customBlock = computed(() => {
    return formItemContext?.block || props.block;
});
const isEmpty = computed(() => {
    if (props.multiple) {
        return (modelValue.value as string[]).length === 0;
    } else {
        return !(modelValue.value as string);
    }
});
const onVisibleChange = (visible: boolean) => {
    isActive.value = visible;
    setTimeout(() => {
        if (!visible) {
            panelRef.value?.resetPanel();
        }
    }, 200);
};

const onChange = () => {
    emits("change"); // 閫氱煡澶栭儴鍙樺寲
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

const onClick = () => {
    if (props.hideAfterClick) {
        tooltipRef.value?.hide();
    }
};

const onClose = (index: number) => {
    panelRef.value?.deleteSelection(index);
};

// 娓呴櫎鍔熻兘
const handleClear = () => {
    panelRef.value?.clearSelection();
    tooltipRef.value?.show();
};

// 澶辩劍澶勭悊
const handleBlur = () => {
    if (formItemContext && formItemContext.trigger === "blur") {
        formItemContext.validate();
    }
};

onMounted(() => {
    // 娉ㄥ唽閲嶇疆鍑芥暟
    if (formItemContext && formItemContext.prop) {
        formContext?.registerResetHandler(formItemContext.prop, () => {
            handleClear();
            formItemContext?.resetValidate();
        });
    }
});
</script>

<style lang="scss" scoped>
.open {
    transition: transform 0.3s ease-in-out;
    transform: rotate(90deg);
    &.active {
        transform: rotate(270deg);
    }
}

.m-date-picker__popper {
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
