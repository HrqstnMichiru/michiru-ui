<template>
    <MTooltip
        ref="tooltipRef"
        @visible-change="onVisibleChange"
        trigger="click"
        transition="unfold"
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
            <div class="m-cascader-options">
                <template v-if="options.length > 0">
                    <div class="m-cascader__menus">
                        <div v-for="(levelOptions, levelIndex) in columns" :key="levelIndex" class="m-cascader__menu">
                            <MScrollBar :max-height="maxHeight" :right="0">
                                <div
                                    v-for="option in levelOptions"
                                    :key="`${levelIndex}-${option.value}`"
                                    class="m-cascader__option"
                                    :class="{
                                        'is-active': isActiveOption(levelIndex, option),
                                        'is-selected': isSelectedLeaf(levelIndex, option),
                                        'is-disabled': option.disabled
                                    }"
                                    @click="handleOptionClick(option, levelIndex)">
                                    <span class="label">{{ option.label }}</span>
                                    <MIcon v-if="option.children?.length" name="material-symbols:chevron-right-rounded" class="arrow-icon" />
                                    <MIcon v-else-if="isSelectedLeaf(levelIndex, option)" name="material-symbols:check-rounded" class="check-icon" />
                                </div>
                            </MScrollBar>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <span class="m-cascader-empty">暂无数据</span>
                </template>
            </div>
        </template>
    </MTooltip>
</template>

<script lang="ts" setup>
import type { MInputInstance, MTooltipInstance } from "@/components";
import { MIcon, MInput, MScrollBar, MTooltip } from "@/components";
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import { computed, inject, ref, useTemplateRef, watch } from "vue";
import type { MCascaderEmits, MCascaderModelValue, MCascaderOption, MCascaderProps } from "./types";

defineOptions({
    name: "MCascader"
});

const props = withDefaults(defineProps<MCascaderProps>(), {
    width: 250,
    placement: "bottom-start",
    placeholder: "请选择",
    maxHeight: 260,
    separator: " / ",
    showAllLevels: true,
    changeOnSelect: false,
    emitPath: true,
    options: () => []
});
const emits = defineEmits<MCascaderEmits>();

const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");
const inputRef = useTemplateRef<MInputInstance>("inputRef");
const isActive = ref(false);
const modelValue = defineModel<MCascaderModelValue>("modelValue");
const selectedPath = ref<MCascaderOption[]>([]);
const activePath = ref<MCascaderOption[]>([]);

const formItemContext = inject<MFormItemContext | null>(MFormItemContextKey, null);
const formContext = inject<MFormContext | null>(MFormContextKey, null);

const customSize = computed(() => {
    return props.size || formItemContext?.size || "medium";
});
const customBlock = computed(() => {
    return props.block || formItemContext?.block;
});
const isEmpty = computed(() => {
    return selectedPath.value.length === 0;
});
const displayText = computed(() => {
    if (selectedPath.value.length === 0) return "";
    if (props.showAllLevels) {
        return selectedPath.value.map(item => item.label).join(props.separator);
    }
    return selectedPath.value[selectedPath.value.length - 1]?.label || "";
});
const columns = computed(() => {
    if (props.options.length === 0) return [];
    const list: MCascaderOption[][] = [props.options];
    let currentOptions = props.options;
    for (const pathNode of activePath.value) {
        const match = currentOptions.find(item => item.value === pathNode.value);
        if (!match || !match.children?.length) break;
        list.push(match.children);
        currentOptions = match.children;
    }
    return list;
});

const cloneModelValue = (value: MCascaderModelValue | undefined): MCascaderModelValue | undefined => {
    if (Array.isArray(value)) return [...value];
    return value;
};

const findPathByValues = (options: MCascaderOption[], values: Array<string | number>) => {
    const path: MCascaderOption[] = [];
    let currentOptions = options;
    for (const value of values) {
        const match = currentOptions.find(item => item.value === value);
        if (!match) break;
        path.push(match);
        currentOptions = match.children || [];
    }
    return path;
};

const findPathByValue = (options: MCascaderOption[], targetValue: string | number): MCascaderOption[] | null => {
    for (const option of options) {
        if (option.value === targetValue) {
            return [option];
        }
        if (option.children?.length) {
            const childPath = findPathByValue(option.children, targetValue);
            if (childPath) {
                return [option, ...childPath];
            }
        }
    }
    return null;
};

const syncFromModel = () => {
    const currentValue = modelValue.value;
    let path: MCascaderOption[] = [];
    if (props.emitPath) {
        if (Array.isArray(currentValue)) {
            path = findPathByValues(props.options, currentValue);
        } else if (currentValue !== undefined && currentValue !== "") {
            path = findPathByValue(props.options, currentValue) || [];
        }
    } else if (Array.isArray(currentValue)) {
        path = findPathByValues(props.options, currentValue);
    } else if (currentValue !== undefined && currentValue !== "") {
        path = findPathByValue(props.options, currentValue) || [];
    }
    selectedPath.value = path;
    activePath.value = [...path];
};

const commitSelection = (path: MCascaderOption[]) => {
    selectedPath.value = [...path];
    activePath.value = [...path];
    if (props.emitPath) {
        modelValue.value = path.map(item => item.value);
    } else {
        modelValue.value = path[path.length - 1]?.value || "";
    }
    emits("change");
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

const isActiveOption = (level: number, option: MCascaderOption) => {
    return activePath.value[level]?.value === option.value;
};

const isSelectedLeaf = (level: number, option: MCascaderOption) => {
    return selectedPath.value[level]?.value === option.value && selectedPath.value.length - 1 === level;
};

const onVisibleChange = (visible: boolean) => {
    isActive.value = visible;
    if (visible) {
        activePath.value = [...selectedPath.value];
        inputRef.value?.focus();
    } else {
        inputRef.value?.blur();
    }
};

const handleOptionClick = (option: MCascaderOption, level: number) => {
    if (option.disabled || props.disabled) return;
    const nextPath = activePath.value.slice(0, level);
    nextPath[level] = option;
    activePath.value = nextPath;
    const hasChildren = !!option.children?.length;

    if (!hasChildren || props.changeOnSelect) {
        commitSelection(nextPath);
    }
    if (!hasChildren) {
        tooltipRef.value?.hide();
    }
};

const handleClear = () => {
    if (props.disabled) return;
    selectedPath.value = [];
    activePath.value = [];
    if (props.emitPath) {
        modelValue.value = [];
    } else {
        modelValue.value = "";
    }
    emits("change");
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
    tooltipRef.value?.show();
};

const handleBlur = () => {
    if (formItemContext && formItemContext.trigger === "blur") {
        formItemContext.validate();
    }
};

watch(
    () => [modelValue.value, props.options, props.emitPath],
    syncFromModel,
    {
        deep: true,
        immediate: true
    }
);

if (formItemContext && formItemContext.prop) {
    const initialValue = cloneModelValue(modelValue.value);
    formContext?.registerResetHandler(formItemContext.prop, () => {
        modelValue.value = cloneModelValue(initialValue);
        syncFromModel();
        formItemContext?.resetValidate();
    });
}
</script>

<style lang="scss" scoped>
.m-cascader-options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
    .m-cascader-empty {
        display: block;
        padding: 8px 10px;
        font-size: 14px;
        text-align: center;
        color: #a8abb2;
    }
}

.m-cascader__menus {
    display: flex;
    min-width: 180px;
    .m-cascader__menu {
        min-width: 180px;
        max-width: 240px;
        border-right: 1px solid #f0f0f0;
        &:last-child {
            border-right: none;
        }
    }
    .m-cascader__option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-height: 32px;
        padding: 0 10px;
        line-height: 1.5;
        cursor: pointer;
        transition: all 0.2s ease;
        .label {
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #606266;
            font-size: 14px;
        }
        .arrow-icon,
        .check-icon {
            flex-shrink: 0;
            font-size: 18px;
            color: #909399;
        }
        &:hover:not(.is-disabled) {
            background-color: rgba(0, 0, 0, 0.08);
        }
        &.is-active:not(.is-disabled) {
            background: rgba(128, 30, 255, 0.12);
            .label,
            .arrow-icon {
                color: #801eff;
            }
        }
        &.is-selected:not(.is-disabled) {
            .label,
            .check-icon {
                color: #801eff;
                font-weight: 500;
            }
        }
        &.is-disabled {
            cursor: not-allowed;
            opacity: 0.6;
            .label,
            .arrow-icon,
            .check-icon {
                color: #c0c4cc;
            }
        }
    }
}

.open {
    transition: transform 0.3s ease-in-out;
    transform: rotate(90deg);
    &.active {
        transform: rotate(270deg);
    }
}
</style>
