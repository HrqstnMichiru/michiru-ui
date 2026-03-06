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
            <MCheckBox variant="primary" :disabled="disabled" v-if="showCheck" @click.stop size="small" :model-value="checked" @update:model-value="treeContext?.toggleSelect(nodeKey)"></MCheckBox>
            <slot :node="props" :data="data">
                <span
                    class="label"
                    :class="{
                        'label--active': checked && !disabled
                    }">
                    {{ label }}
                </span>
            </slot>
        </div>
        <Transition name="slide" v-on="transitionEvents">
            <div class="tree-node__popper" v-show="expanded">
                <TreeNode v-for="child in children" :key="child.nodeKey" v-bind="child" :level="level! + 1">
                    <template #default="{ node, data }: { node: TreeNodeProps<T>; data: T }">
                        <slot :node="node" :data="data"></slot>
                    </template>
                </TreeNode>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup generic="T extends TreeData">
import { MCheckBox, MIcon } from "@/components";
import { computed, inject } from "vue";
import type { TreeContext, TreeData, TreeNodeProps } from "./types";
import { TreeContextKey } from "./types";

defineOptions({
    name: "MTreeNode"
});
const props = defineProps<TreeNodeProps<T>>();
const treeContext = inject<TreeContext>(TreeContextKey)!;

const paddingLeft = computed(() => {
    return `${33 * props.level! + 10}px`;
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
            font-weight: 400;
            transition: all 0.2s ease;
            &.label--active {
                font-weight: 600;
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
