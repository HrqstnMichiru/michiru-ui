<template>
    <div class="tree">
        <TreeNode v-for="node in _data" :key="node.nodeKey" v-bind="node">
            <template #default="{ node: slotNode, data: slotData }: { node: TreeNodeProps<T>; data: T }">
                <slot :node="slotNode" :data="slotData"></slot>
            </template>
        </TreeNode>
    </div>
</template>

<script lang="ts" setup generic="T extends TreeData">
import { computed, provide, reactive, ref, shallowReactive } from "vue";
import TreeNode from "./TreeNode.vue";
import type { TreeContext, TreeData, TreeEmits, TreeInstance, TreeNodeProps, TreeProps } from "./types";
import { TreeContextKey } from "./types";

defineOptions({
    name: "MTree"
});
const props = withDefaults(defineProps<TreeProps<T>>(), {
    selectable: false,
    onlyLeaf: false,
    onlyPrefix: false,
    syncParentWithChildren: false,
    nodeKey: "id",
    nodeLabel: "label",
    duration: 300,
    selectedKeys: (): Array<number | string> => [],
    expandedKeys: (): Array<number | string> => [],
    data: () => []
});
const emits = defineEmits<TreeEmits>();

const selectedNodes = shallowReactive<Set<TreeNodeProps>>(new Set()); // 当前选中节点集合
const selectedNodeCount = ref<number>(0); // 可选节点总数
const getDataKey = (node: T): string | number => node[props.nodeKey];
const getDataLabel = (node: T): string => node[props.nodeLabel];

// 递归预处理原始数据，生成带 parent/level 等元信息的节点树
const preProcessData = (data: T[]) => {
    const selectedKeysSet = new Set(props.selectedKeys);
    const process = (data: T, parent: TreeNodeProps<T> | undefined = undefined, level: number = 0) => {
        const nodeKey = getDataKey(data);
        const label = getDataLabel(data);
        const showCheck = props.selectable ? (props.onlyLeaf ? !data.children : true) : false;
        const disabled = props.syncParentWithChildren ? parent?.disabled || !!data.disabled : !!data.disabled;
        if (showCheck && !disabled) selectedNodeCount.value++; // 统计可选节点总数
        const isLeaf = !data.children;
        const checked = selectedKeysSet.has(nodeKey);

        const processedNode: TreeNodeProps<T> = {
            nodeKey,
            label,
            level,
            isLeaf,
            data,
            parent,
            showCheck,
            disabled,
            checked,
            expanded: false
        };
        if (data.children) {
            processedNode.children = [];
            for (const child of data.children) {
                const processedChild = process(child, processedNode, level + 1);
                processedNode.children.push(processedChild);
            }
        }
        if (checked) selectedNodes.add(processedNode); // 初始化选中节点集合
        return processedNode;
    };
    return data.map(item => process(item));
};
const _data = reactive(preProcessData(props.data)) as TreeNodeProps<T>[];

// 构建 nodeMap，供后续 O(1) 查找
const nodeMap = new Map<string | number, TreeNodeProps<T>>(); // nodeKey -> TreeNodeProps
const parentPathMap = new Map<string | number, (string | number)[]>(); // nodeKey -> 父节点路径（不包含自身）
const buildNodeMap = (nodes: TreeNodeProps<T>[] | undefined, path: (string | number)[] = []) => {
    if (!nodes) return;
    nodes.forEach(node => {
        nodeMap.set(node.nodeKey, node);
        const currentPath = [...path];
        if (node.parent) currentPath.push(node.parent.nodeKey);
        parentPathMap.set(node.nodeKey, currentPath);
        buildNodeMap(node.children);
    });
};
buildNodeMap(_data);

// 递归将节点及其子节点的 checked 置为 false
const removeNodes = (nodes: TreeNodeProps<T>[] | undefined) => {
    if (!nodes) return;
    nodes.forEach(node => {
        if (node.showCheck) {
            selectedNodes.delete(node);
            node.checked = false;
        }
        removeNodes(node.children);
    });
};
// 递归将节点及其子节点的 checked 置为 true
const addNodes = (nodes: TreeNodeProps<T>[] | undefined) => {
    if (!nodes) return;
    nodes.forEach(node => {
        // 联动模式下父节点被禁用其子节点也会被禁用，因此禁用节点不添加
        if (props.syncParentWithChildren && node.disabled) return;
        // 非联动模式下只要节点本身展示并且不禁用就添加
        if (node.showCheck && !node.disabled) {
            node.checked = true;
            selectedNodes.add(node);
            emits("node-select", node);
        }
        addNodes(node.children);
    });
};

// 切换节点选中状态
const toggleSelect = (nodeKey: string | number) => {
    const target = nodeMap.get(nodeKey);
    if (!target) return;

    const newChecked = !target.checked;
    target.checked = newChecked;

    if (newChecked) {
        emits("node-select", target);
        selectedNodes.add(target);
        if (props.syncParentWithChildren) addNodes(target.children);
    } else {
        selectedNodes.delete(target);
        if (props.syncParentWithChildren) removeNodes(target.children);
    }

    // 向上同步父节点选中状态
    if (props.syncParentWithChildren && !props.onlyLeaf) {
        let parent: TreeNodeProps<T> | undefined = target.parent;
        while (parent) {
            if (parent.showCheck && !parent.disabled) {
                const allChildrenSelected = parent.children!.every(child => {
                    if (child.disabled) return true; // 禁用节点不影响父节点状态
                    return child.checked;
                });
                parent.checked = allChildrenSelected;
                if (allChildrenSelected) {
                    selectedNodes.add(parent);
                    emits("node-select", parent);
                }
            }
            parent = parent.parent;
        }
    }
    emits("selection-change", getSelectedNodes());
};

// 切换全选状态
const selectAll = computed(() => {
    return Array.from(selectedNodes).filter(node => !node.disabled).length === selectedNodeCount.value && selectedNodeCount.value > 0;
});
const checkAll = () => {
    addNodes(_data);
    emits("selection-change", getSelectedNodes());
};
const uncheckAll = () => {
    const clearAll = (nodes: TreeNodeProps<T>[]) => {
        nodes.forEach(node => {
            if (node.showCheck && !node.disabled) {
                selectedNodes.delete(node);
            }
            node.checked = false;
            if (node.children) clearAll(node.children);
        });
    };
    clearAll(_data);
    emits("selection-change", getSelectedNodes());
};
const toggleSelectAll = () => {
    if (selectAll.value) {
        uncheckAll();
    } else {
        checkAll();
    }
};

// 切换节点展开状态
const toggleExpand = (nodeKey: string | number) => {
    const target = nodeMap.get(nodeKey);
    if (!target) return;
    const parentPath = parentPathMap.get(nodeKey);
    if (parentPath) {
        // 先展开父节点路径，确保目标节点可见
        parentPath.forEach(parentKey => {
            const parentNode = nodeMap.get(parentKey);
            if (parentNode) parentNode.expanded = true;
        });
    }
    if (props.accordion) {
        // 手风琴模式：收起同级其他节点
        const siblings = target.parent ? target.parent.children || [] : _data;
        siblings.forEach(sibling => {
            if (sibling.nodeKey !== nodeKey) sibling.expanded = false;
        });
    }
    target.expanded = !target.expanded;
};

// 切换全部展开/收起状态
const expandAll = ref<boolean>(props.expandAll); // 全部展开状态
const toggleExpandAll = () => {
    expandAll.value = !expandAll.value;
    const setExpand = (nodes: TreeNodeProps<T>[], value: boolean) => {
        nodes.forEach(node => {
            if (!node.children) return;
            node.expanded = value;
            setExpand(node.children, value);
        });
    };
    setExpand(_data, expandAll.value);
};
// 根据 expandedKeys 初始化展开状态
const setExpandState = (keys: Array<string | number>) => {
    keys.forEach(key => {
        const parentPath = parentPathMap.get(key);
        if (parentPath) {
            parentPath.forEach(parentKey => {
                const parentNode = nodeMap.get(parentKey);
                if (parentNode) parentNode.expanded = true;
            });
        }
        const node = nodeMap.get(key);
        if (node) node.expanded = true;
    });
};
if (expandAll.value) {
    toggleExpandAll();
} else {
    setExpandState(props.expandedKeys);
}

const nodeClick = (node: TreeNodeProps<T>) => {
    emits("node-click", node);
};

const getSelectedNodes = (): T[] => {
    return Array.from(selectedNodes).map(node => node.data);
};

provide<TreeContext>(TreeContextKey, {
    toggleSelect,
    toggleExpand,
    nodeClick,
    onlyPrefix: props.onlyPrefix,
    duration: props.duration
});

defineExpose<TreeInstance<T>>({
    getSelectedNodes,
    toggleSelectAll,
    checkAll,
    uncheckAll,
    toggleExpandAll,
    toggleSelect,
    toggleExpand,
    get selectAll() {
        return selectAll.value;
    }
});
</script>

<style lang="scss" scoped>
.tree {
    display: flex;
    flex-direction: column;
    width: 100%;
}
</style>
