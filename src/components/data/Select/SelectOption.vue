<template>
    <div
        class="m-select-option"
        @click="onClick"
        :class="{
            'is-disabled': disabled,
            'is-checked': selectContext?.isSelected(value)
        }">
        <slot :label="label" :value="value">
            <span class="label">{{ label }}</span>
            <MIcon name="material-symbols:check-rounded" class="check" v-if="selectContext?.isSelected(value)"></MIcon>
        </slot>
    </div>
</template>

<script lang="ts" setup>
import { MIcon } from "@/components";
import { inject, onMounted } from "vue";
import type { SelectContext, SelectOptionProps } from "./types";
import { SelectContextKey } from "./types";

defineOptions({
    name: "MSelectOption"
});

const props = defineProps<SelectOptionProps>();
const selectContext = inject<SelectContext>(SelectContextKey);

const onClick = () => {
    selectContext?.setModelValue(props.label, props.value, false);
};

onMounted(() => {
    if (selectContext) {
        selectContext.register(props.label, props.value);
        if (selectContext.isSelected(props.value)) {
            // 初始化时如果已选中则设置值
            selectContext.setModelValue(props.label, props.value, true);
        }
    }
});
</script>

<style lang="scss" scoped>
.m-select-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    width: 100%;
    height: 36px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 4px;
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
        font-size: 18px;
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
</style>
