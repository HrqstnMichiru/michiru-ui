<template>
    <MTooltip
        ref="tooltipRef"
        @visible-change="visibleChange"
        trigger="click"
        sync-width
        transition="unfold"
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
            :prefix-icon="prefixIcon"
            :block="customBlock"
            :width="width"
            :size="customSize"
            :border-always="borderAlways"
            :injected="false"
            :is-empty="isEmpty"
            @blur="handleBlur"
            @clear="handleClear">
            <template v-if="multiple" #prefix>
                <MTag
                    v-for="(node, index) in displayLabels"
                    :key="node[nodeKey]"
                    :text="node[nodeLabel]"
                    variant="gray"
                    outlined
                    closable
                    :size="customSize"
                    @close="onClose(node[nodeKey], index)"></MTag>
                <MTooltip transition="unfold" theme="light" :z-index="10002">
                    <MTag :text="`+${hiddenLabels.length}`" v-if="hiddenLabels.length > 0" :size="customSize" variant="gray" shape="circle" outlined></MTag>
                    <template #content>
                        <div
                            class="m-tree-select__popper"
                            :style="{
                                maxWidth: `${tooltipWidth}px`
                            }">
                            <MTag
                                variant="gray"
                                outlined
                                closable
                                v-for="(node, index) in hiddenLabels"
                                :key="node[nodeKey]"
                                :text="node[nodeLabel]"
                                @close="onClose(node[nodeKey], index + maxCount)"
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
            <div class="m-tree-select-options">
                <template v-if="data.length > 0">
                    <slot name="header">
                        <div class="m-tree-select-header" v-if="multiple && hasSelectAll">
                            <MCheckBox variant="primary" @update:model-value="() => toggleSelectAll()" :model-value="selectAllState"></MCheckBox>
                            <span>全选</span>
                        </div>
                    </slot>
                    <MScrollBar :max-height="maxHeight" :right="0">
                        <MTree
                            ref="treeRef"
                            :selectable="multiple"
                            :only-prefix="!multiple && !onlyLeaf"
                            :data="data"
                            :node-key="nodeKey"
                            :node-label="nodeLabel"
                            :only-leaf="onlyLeaf"
                            :sync-parent-with-children="syncParentWithChildren"
                            :selected-keys="selectedKeys"
                            :expand-all="expandAll"
                            :duration="duration"
                            :accordion="accordion"
                            @node-click="onNodeClick"
                            @selection-change="onSelectionChange">
                            <template #default="{ node }">
                                <div
                                    class="m-tree-select-option"
                                    :class="{
                                        'is-checked': node.checked || node.indeterminate || modelValue === node.nodeKey,
                                        'is-disabled': node.disabled
                                    }">
                                    <span class="label">{{ node.label }}</span>
                                    <MIcon name="material-symbols:check-rounded" v-if="!multiple && modelValue === node.nodeKey" class="check-icon"></MIcon>
                                </div>
                            </template>
                        </MTree>
                    </MScrollBar>
                    <slot name="footer"></slot>
                </template>
                <template v-else>
                    <span class="m-tree-select-empty">暂无数据</span>
                </template>
            </div>
        </template>
    </MTooltip>
</template>

<script lang="ts" setup generic="T extends MTreeData">
import type { MInputInstance, MTooltipInstance, MTreeInstance } from "@/components";
import { MCheckBox, MIcon, MInput, MScrollBar, MTag, MTooltip, MTree } from "@/components";
import type { MFormContext, MFormItemContext } from "@/components/data/MForm/types";
import { MFormContextKey, MFormItemContextKey } from "@/components/data/MForm/types";
import type { MTreeData, MTreeNodeProps } from "@/components/dispaly/MTree/types";
import { computed, inject, onMounted, ref, shallowRef, useTemplateRef } from "vue";
import type { MTreeSelectEmits, MTreeSelectProps } from "./types";

defineOptions({
    name: "MTreeSelect"
});
const props = withDefaults(defineProps<MTreeSelectProps<T>>(), {
    placeholder: "请选择",
    hideAfterClick: true,
    width: 250,
    placement: "bottom",
    maxHeight: 300,
    maxCount: 3,
    tooltipWidth: 250,
    nodeKey: "id",
    nodeLabel: "label",
    duration: 300,
    accordion: false,
    syncParentWithChildren: false,
    expandAll: false,
    hasSelectAll: false,
    onlyLeaf: false,
    data: () => []
});
const emits = defineEmits<MTreeSelectEmits>();

const tooltipRef = useTemplateRef<MTooltipInstance>("tooltipRef");
const treeRef = useTemplateRef<MTreeInstance>("treeRef");
const inputRef = useTemplateRef<MInputInstance>("inputRef");
const optionsRef = useTemplateRef<HTMLDivElement>("optionsRef");
const isActive = ref<boolean>(false);
const modelValue = defineModel<string | number | Array<string | number>>("modelValue");
const selectNodeList = shallowRef<T[]>([]);
const displayText = computed<string>(() => {
    if (!props.multiple && modelValue.value) {
        return selectNodeList.value[0]?.[props.nodeLabel];
    }
    return "";
});
const displayLabels = computed(() => {
    if (props.multiple) {
        if (props.maxCount && selectNodeList.value.length > props.maxCount) {
            return selectNodeList.value.slice(0, props.maxCount);
        } else {
            return selectNodeList.value;
        }
    }
    return new Array<T>();
});
const hiddenLabels = computed(() => {
    if (props.multiple && props.maxCount && selectNodeList.value.length > props.maxCount) {
        return selectNodeList.value.slice(props.maxCount);
    }
    return new Array<T>();
});
const placeholder = computed(() => {
    if (props.multiple && selectNodeList.value.length > 0) {
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
        return selectNodeList.value.length === 0;
    } else {
        return !modelValue.value;
    }
});

const selectAll = computed(() => {
    return treeRef.value?.selectAll || false;
});
const selectedSize = computed(() => {
    return treeRef.value?.selectedSize || 0;
});
const selectableSize = computed(() => {
    return treeRef.value?.selectableSize || 0;
});
const isPartiallySelected = computed(() => {
    return selectedSize.value > 0 && selectedSize.value < selectableSize.value;
});
const selectAllState = computed<boolean | "indeterminate">(() => {
    if (selectAll.value) return true;
    if (isPartiallySelected.value) return "indeterminate";
    return false;
});
const toggleSelectAll = () => {
    treeRef.value?.toggleSelectAll();
};

const visibleChange = (visible: boolean) => {
    isActive.value = visible;
    if (!visible) {
        inputRef.value?.blur();
    }
};

const handleClearField = () => {
    if (props.multiple) {
        treeRef.value?.uncheckAll();
        modelValue.value = [];
        emits("change");
    } else {
        modelValue.value = "";
        selectNodeList.value = [];
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

const onNodeClick = (node: MTreeNodeProps<T>) => {
    if (props.multiple) return;
    if (props.onlyLeaf && !node.isLeaf) return;

    selectNodeList.value = [node.data];
    modelValue.value = node.nodeKey;
    emits("change");
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
    if (props.hideAfterClick) {
        tooltipRef.value?.hide();
    }
};

const onSelectionChange = (selectedNodes: Array<T>) => {
    if (!props.multiple) return;
    selectNodeList.value = selectedNodes;
    const newValue = selectedNodes.map(node => node[props.nodeKey]);
    modelValue.value = newValue;
    emits("change");
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

const onClose = (nodeKey: string | number, index: number) => {
    treeRef.value?.toggleSelect(nodeKey);
    const newLabels = [...(modelValue.value as string[])];
    newLabels.splice(index, 1);
    modelValue.value = newLabels;
    emits("change");
    if (formItemContext && formItemContext.trigger === "change") {
        formItemContext.validate();
    }
};

if (formItemContext && formItemContext.prop) {
    formContext?.registerResetHandler(formItemContext.prop, () => {
        handleClear();
        formItemContext?.resetValidate();
    });
}
</script>

<style lang="scss" scoped>
.m-tree-select-options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4px;
    background-color: #fff;
    border-radius: 6px;
    position: relative;
    border: 1px solid rgb(220, 223, 230);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.12);
    .m-tree-select-header {
        padding: 6px;
        font-size: 15px;
        gap: 5px;
        font-weight: 500;
        margin-bottom: 3px;
        border-bottom: 1px solid rgb(220, 223, 230);
        display: flex;
        align-items: center;
    }
    .m-tree-select-option {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s ease;
        .label {
            flex: 1;
            font-size: 14px;
            font-weight: 500;
            color: rgb(96, 98, 102);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: all 0.2s ease;
        }
        .check-icon {
            flex-shrink: 0;
            font-size: 20px;
            color: rgb(41, 52, 61);
            opacity: 0.75;
            transition: all 0.2s ease;
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
                color: #007bff;
                font-weight: 500;
            }
            .check-icon {
                color: #007bff;
                opacity: 1;
            }
        }
    }
    .m-tree-select-empty {
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

.m-tree-select__popper {
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
