<template>
    <slot></slot>
</template>

<script lang="ts" setup>
import { computed, provide, shallowReactive, watch } from "vue";
import type { MSelectionContext, MSelectionInstance, MSelectionProps } from "./types";
import { MSelectionContextKey } from "./types";

defineOptions({
    name: "MSelection"
});
const props = defineProps<MSelectionProps>();
const modelValue = defineModel<string | number | Array<string | number>>();
const allValues = shallowReactive<Set<string | number>>(new Set()); // 所有可选项的值集合
const selectedValues = shallowReactive<Set<string | number>>(new Set()); // 已选项的值集合

// 同步模型到状态
const syncModelToState = (value: string | number | Array<string | number> | undefined) => {
    selectedValues.clear();
    if (value === undefined) return;
    if (props.multiple) {
        (value as Array<string | number>).forEach(item => selectedValues.add(item));
    } else {
        selectedValues.add(value as string | number);
    }
};

// 同步状态到模型
const syncStateToModel = () => {
    if (props.multiple) {
        modelValue.value = Array.from(selectedValues);
    } else {
        const [first] = Array.from(selectedValues);
        modelValue.value = first;
    }
};

// 设置单个元素的选中状态
const setSelected = (value: string | number) => {
    const targetSelected = selectedValues.has(value);
    if (props.multiple) {
        if (targetSelected) {
            selectedValues.delete(value);
        } else {
            selectedValues.add(value);
        }
    } else {
        selectedValues.clear(); // 单选时先清空已选项
        if (!targetSelected) {
            selectedValues.add(value);
        }
    }
    syncStateToModel();
};

// 全选
const selectAll = () => {
    if (!props.multiple) return;
    if (allValues.size === 0) return;
    allValues.forEach(value => selectedValues.add(value));
    syncStateToModel();
};

// 清除选中状态
const clearSelection = () => {
    selectedValues.clear();
    syncStateToModel();
};

// 注册可选项
const register = (value: string | number) => {
    allValues.add(value);
};

// 取消注册可选项，主要用于可选项会动态变化的场景
const unregister = (value: string | number) => {
    allValues.delete(value);
    if (selectedValues.has(value)) {
        selectedValues.delete(value);
        syncStateToModel();
    }
};

const isAllSelected = computed(() => {
    return allValues.size > 0 && selectedValues.size === allValues.size;
});

const isPartiallySelected = computed(() => {
    return selectedValues.size > 0 && selectedValues.size < allValues.size;
});

provide<MSelectionContext>(MSelectionContextKey, {
    setSelected,
    isSelected: (value: string | number) => selectedValues.has(value),
    register,
    unregister,
    multiple: props.multiple,
    itemKey: props.itemKey
});

// 监听模型值变化，同步到状态
watch(
    () => modelValue.value,
    value => {
        syncModelToState(value);
    },
    {
        immediate: true
    }
);

defineExpose<MSelectionInstance>({
    get selectedItems() {
        return Array.from(selectedValues);
    },
    get isAllSelected() {
        return isAllSelected.value;
    },
    get isPartiallySelected() {
        return isPartiallySelected.value;
    },
    selectAll,
    clearSelection
});
</script>
