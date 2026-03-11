<template>
    <MInput
        type="text"
        :width="width"
        :size="customSize"
        :clearable="clearable"
        :readonly="readonly"
        :block="customBlock"
        :placeholder="placeholder"
        v-model.trim="inputValue"
        :injected="false"
        @keydown.enter="onEnter"
        @clear="onClear"
        @blur="onBlur"
        @focus="onFocus">
        <template #prefix v-if="tags.length > 0">
            <MTag variant="gray" closable v-for="(tag, index) in displayTags" :key="index" :text="tag" @close="onClose(index)" :size="customSize" plain></MTag>
            <MTooltip transition="none" theme="light" :z-index="2000">
                <MTag :text="`+${hiddenTags.length}`" v-if="hiddenTags.length > 0" :size="customSize" variant="gray" shape="circle"></MTag>
                <template #content>
                    <div
                        class="m-input-tag__popper"
                        :style="{
                            maxWidth: `${tooltipWidth}px`
                        }">
                        <MTag variant="gray" closable v-for="(tag, index) in hiddenTags" :key="index" :text="tag" @close="onClose(index + maxCount)" :size="customSize" plain></MTag>
                    </div>
                </template>
            </MTooltip>
        </template>
    </MInput>
</template>

<script lang="ts" setup>
import { MInput, MTag, MTooltip } from "@/components";
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import { computed, inject, ref } from "vue";
import type { MInputTagEmits, MInputTagProps } from "./types";

defineOptions({
    name: "MInputTag"
});
const props = withDefaults(defineProps<MInputTagProps>(), {
    clearable: false,
    readonly: false,
    block: false,
    maxCount: 2,
    tooltipWidth: 250
});
const emits = defineEmits<MInputTagEmits>();

const formItemContext = inject<MFormItemContext | null>(MFormItemContextKey, null);
const formContext = inject<MFormContext | null>(MFormContextKey, null);
const customSize = computed(() => {
    return props.size || formItemContext?.size || "medium";
});
const customBlock = computed(() => {
    return props.block || formItemContext?.block;
});
const inputValue = ref<string>("");
const tags = defineModel<string[]>("modelValue", {
    default: () => []
});
const displayTags = computed(() => {
    if (props.maxCount && tags.value.length > props.maxCount) {
        return tags.value.slice(0, props.maxCount);
    }
    return tags.value;
});
const hiddenTags = computed(() => {
    if (props.maxCount && tags.value.length > props.maxCount) {
        return tags.value.slice(props.maxCount);
    }
    return [];
});
const placeholder = computed(() => {
    if (displayTags.value.length > 0) return "";
    return props.placeholder;
});

if (formItemContext && formItemContext.prop) {
    formContext?.registerResetHandler(formItemContext.prop, () => {
        tags.value = [];
        inputValue.value = "";
        formItemContext?.resetValidate();
    });
}

const onEnter = () => {
    if (inputValue.value === "") return;
    if (tags.value.includes(inputValue.value)) {
        inputValue.value = "";
        return;
    } else {
        const newTags = [...tags.value, inputValue.value];
        tags.value = newTags;
        emits("change");
        inputValue.value = "";
    }
};

const onClose = (index: number) => {
    const newTags = [...tags.value];
    newTags.splice(index, 1);
    tags.value = newTags;
    emits("change");
};

const onClear = () => {
    tags.value = [];
    inputValue.value = "";
    emits("change");
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

const onBlur = () => {
    emits("blur");
};

const onFocus = () => {
    emits("focus");
};
</script>

<style lang="scss" scoped>
.m-input-tag__popper {
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
