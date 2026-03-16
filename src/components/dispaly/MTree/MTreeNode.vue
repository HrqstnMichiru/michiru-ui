<template>
    <div
        class="tree-node"
        :style="{
            '--tree-node-speed': `${treeContext?.duration}ms`
        }">
        <div class="tree-node__trigger" :style="{ paddingLeft }" @click="onNodeClick">
            <MIcon
                name="fluent:triangle-right-48-filled"
                class="expand-icon"
                @click="onPrefixClick"
                v-if="children"
                :class="{
                    'expand-icon--active': expanded
                }">
                >
            </MIcon>
            <MCheckBox
                variant="primary"
                :disabled="disabled"
                v-if="showCheck"
                @click.stop
                size="small"
                :model-value="checkState"
                @update:model-value="treeContext?.toggleSelect(nodeKey)"></MCheckBox>
            <slot :node="props" :data="data">
                <span
                    class="label"
                    :class="{
                        'label--active': (checked || indeterminate) && !disabled
                    }">
                    {{ label }}
                </span>
            </slot>
        </div>
        <Transition name="slide" v-on="transitionEvents">
            <div class="tree-node__popper" v-show="expanded">
                <MTreeNode v-for="child in children" :key="child.nodeKey" v-bind="child" :level="level! + 1">
                    <template #default="{ node, data }">
                        <slot :node="node" :data="data"></slot>
                    </template>
                </MTreeNode>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup generic="T extends MTreeData">
import { MCheckBox, MIcon } from "@/components";
import { computed, inject } from "vue";
import type { MTreeContext, MTreeData, MTreeNodeProps } from "./types";
import { MTreeContextKey } from "./types";

defineOptions({
    name: "MTreeNode"
});
defineSlots<{
    default: (props: { node: MTreeNodeProps<T>; data: T }) => any;
}>();
const props = defineProps<MTreeNodeProps<T>>();
const treeContext = inject<MTreeContext>(MTreeContextKey)!;

const paddingLeft = computed(() => {
    return `${33 * props.level! + 10}px`;
});
const checkState = computed<boolean | "indeterminate">(() => {
    return props.indeterminate ? "indeterminate" : props.checked;
});

const onNodeClick = () => {
    if (!treeContext?.onlyPrefix) {
        treeContext?.toggleExpand(props.nodeKey);
    }
    treeContext?.nodeClick(props);
};
const onPrefixClick = (event: MouseEvent) => {
    if (treeContext?.onlyPrefix) {
        event.stopPropagation();
        treeContext?.toggleExpand(props.nodeKey);
    }
};

const transitionEvents: Record<string, (el: HTMLElement) => void> = {
    beforeEnter(el: HTMLElement) {
        el.style.height = "0";
        el.style.overflow = "hidden";
    },
    enter(el: HTMLElement) {
        el.style.height = `${el.scrollHeight}px`;
    },
    afterEnter(el: HTMLElement) {
        el.style.overflow = "";
        el.style.height = "";
    },
    beforeLeave(el: HTMLElement) {
        el.style.overflow = "hidden";
        el.style.height = `${el.scrollHeight}px`;
    },
    leave(el: HTMLElement) {
        el.style.height = "0";
    },
    afterLeave(el: HTMLElement) {
        el.style.overflow = "";
        el.style.height = "";
    }
};
</script>

<style lang="scss" scoped>
.tree-node {
    width: 100%;
    .tree-node__trigger {
        display: flex;
        width: 100%;
        height: 32px;
        line-height: 32px;
        transition: background-color 0.2s var(--ease-soft-spring);
        align-items: center;
        gap: 3px;
        cursor: pointer;
        &:hover {
            background-color: rgba(0, 0, 0, 0.08);
        }
        .expand-icon {
            font-size: 13px;
            transition: transform 0.2s ease-in-out;
            color: #a3a6ac;
            &.expand-icon--active {
                transform: rotate(90deg);
            }
        }
        .label {
            color: rgb(96, 98, 102);
            font-size: 15px;
            font-weight: 500;
            transition: all 0.2s ease;
            &.label--active {
                color: #007bff;
            }
        }
    }
    .tree-node__popper {
        width: 100%;
    }
}

.slide-enter-active,
.slide-leave-active {
    transition: all var(--tree-node-speed) var(--ease-in-out);
}
</style>
